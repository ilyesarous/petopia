package tn.esprit.petopia_backend.controller.payment;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.v2.billing.MeterEventStreamCreateParams;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import tn.esprit.petopia_backend.entities.event.Event;
import tn.esprit.petopia_backend.entities.payment.PaymentRequest;
import tn.esprit.petopia_backend.entities.store.Cart;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.event.EventRepository;
import tn.esprit.petopia_backend.repositories.payment.PaymentRepository;
import tn.esprit.petopia_backend.repositories.store.CartRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import tn.esprit.petopia_backend.services.payment.PaymentService;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/api/payment")
@AllArgsConstructor
public class PaymentController {

    private final CartRepository cartRepository;
    private PaymentService paymentService;
    private UserRepository userRepository;
    private EventRepository eventRepository;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, Object>> createCheckoutSession(
            @RequestBody PaymentRequest paymentRequest) throws StripeException {

        User user = userRepository.findById(paymentRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        User vet = userRepository.findById(paymentRequest.getVetId())
                .orElseThrow(() -> new RuntimeException("Vet not found"));

        paymentRequest.setUser(user);
        paymentRequest.setUserVet(vet);

        // Convertir le montant et créer la session Stripe
        Double exchangeRate = 0.33;
        Long amountInCents = (long) (paymentRequest.getAmount() * exchangeRate * 100);

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://petopia.local:31158/petopia/auth/api/payment/success")
                .setCancelUrl("http://petopia.local:31158/petopia/auth/api/payment/cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd") // Utiliser USD au lieu de TND
                                                .setUnitAmount(amountInCents) // Montant en centimes
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(paymentRequest.getDescription())
                                                                .build()
                                                )
                                                .build()
                                ).setQuantity(1L)
                                .build()
                )
                .build();
        paymentService.savePayment(paymentRequest);
        // Création de la session Stripe
        Session session = Session.create(params);

        // Création de la réponse avec l'ID de la session et l'URL de checkout
        Map<String, Object> result = new HashMap<>();
        result.put("sessionId", session.getId());
        result.put("checkoutUrl", session.getUrl());

        // Retourne la réponse dans un format JSON
        return ResponseEntity.ok(result);
    }

    @PostMapping("/create-checkout-session-shop")
    public ResponseEntity<Map<String, Object>> createCheckoutSessionShop(
            @RequestBody PaymentRequest paymentRequest) throws StripeException {

        User user = userRepository.findById(paymentRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = cartRepository.findCartByUser(user);

        paymentRequest.setUser(user);
        paymentRequest.setCart(cart);

        // Convertir le montant et créer la session Stripe
        Double exchangeRate = 0.33;
        Long amountInCents = (long) (paymentRequest.getAmount() * exchangeRate * 100);

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://petopia.local:31158/petopia/auth/api/payment/successShop")
                .setCancelUrl("http://petopia.local:31158/petopia/auth/api/payment/cancelShop")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd") // Utiliser USD au lieu de TND
                                                .setUnitAmount(amountInCents) // Montant en centimes
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(paymentRequest.getDescription())
                                                                .build()
                                                )
                                                .build()
                                ).setQuantity(1L)
                                .build()
                )
                .build();

        paymentService.savePayment(paymentRequest);
        // Création de la session Stripe
        Session session = Session.create(params);

        // Création de la réponse avec l'ID de la session et l'URL de checkout
        Map<String, Object> result = new HashMap<>();
        result.put("sessionId", session.getId());
        result.put("checkoutUrl", session.getUrl());

        // Retourne la réponse dans un format JSON
        return ResponseEntity.ok(result);
    }

    @GetMapping("/success")
    public RedirectView getSuccessVet() {
        String redirectUrl = "http://petopia.local:31159/vet/dash-principale-user?payment_status=success";
        return new RedirectView(redirectUrl);
    }

    @GetMapping("/cancel")
    public RedirectView cancelVet() {
        String redirectUrl = "http://petopia.local:31159/vet/dash-principale-user?payment_status=cancel";
        return new RedirectView(redirectUrl);
    }

    @GetMapping("/successShop")
    public RedirectView getSuccessShop() {
        String redirectUrl = "http://petopia.local:31159/cart?payment_status=success";
        return new RedirectView(redirectUrl);
    }
    @GetMapping("/cancelShop")
    public RedirectView cancelShop() {
        String redirectUrl = "http://petopia.local:31159/cart?payment_status=cancel";
        return new RedirectView(redirectUrl);
    }

    @GetMapping("/revenue/{vetId}")
    public ResponseEntity<Double> getVetRevenue(@PathVariable Long vetId) {
        Double revenue = paymentService.getTotalRevenueForVet(vetId);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/vet-payments/{vetId}")
    public ResponseEntity<List<PaymentRequest>> getPaymentsByVet(@PathVariable Long vetId) {
        List<PaymentRequest> payments = paymentService.findByUserVetId(vetId);
        return ResponseEntity.ok(payments);
    }



    @PostMapping("/create-checkout-session-Event")
    public ResponseEntity<Map<String, Object>> createCheckoutSessionEvent(
            @RequestBody PaymentRequest paymentRequest) throws StripeException {

        User user = userRepository.findById(paymentRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
       Event event = eventRepository.getReferenceById(paymentRequest.getEvent().getIdEvent());

        paymentRequest.setUser(user);
        paymentRequest.setEvent(event);

        // Convertir le montant et créer la session Stripe
        Double exchangeRate = 0.33;
        Long amountInCents = (long) (paymentRequest.getAmount() * exchangeRate * 100);

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://petopia.local:31158/petopia/auth/api/payment/successEvent")
                .setCancelUrl("http://petopia.local:31158/petopia/auth/api/payment/cancelEvent")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd") // Utiliser USD au lieu de TND
                                                .setUnitAmount(amountInCents) // Montant en centimes
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(paymentRequest.getDescription())
                                                                .build()
                                                )
                                                .build()
                                ).setQuantity(1L)
                                .build()
                )
                .build();
        paymentService.savePayment(paymentRequest);
        // Création de la session Stripe
        Session session = Session.create(params);

        // Création de la réponse avec l'ID de la session et l'URL de checkout
        Map<String, Object> result = new HashMap<>();
        result.put("sessionId", session.getId());
        result.put("checkoutUrl", session.getUrl());

        // Retourne la réponse dans un format JSON
        return ResponseEntity.ok(result);
    }

    @GetMapping("/successEvent")
    public RedirectView getSuccessEvent() {
        String redirectUrl = "http://petopia.local:31159/participations?payment_status=success";
        return new RedirectView(redirectUrl);
    }

    @GetMapping("/cancelEvent")
    public RedirectView cancelEvent() {
        String redirectUrl = "http://petopia.local:31159/participations?payment_status=cancel";
        return new RedirectView(redirectUrl);
    }
}