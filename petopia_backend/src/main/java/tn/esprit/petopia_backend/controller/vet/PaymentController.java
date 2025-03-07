package tn.esprit.petopia_backend.controller.vet;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.vet.PaymentRequest;


import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, Object>> createCheckoutSession(@RequestBody PaymentRequest paymentRequest) throws StripeException {
        // Convertir le montant en TND en USD (taux de change approximatif)
        Double exchangeRate = 0.33; // 1 TND = 0.33 USD (vérifiez le taux actuel)
        Long amountInCents = (long) (paymentRequest.getAmount() * exchangeRate * 100);

        // Création des paramètres pour la session Stripe
        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:8082/petopia/api/payment/success")
                .setCancelUrl("http://localhost:8082/petopia/api/payment/cancel")
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
    public String getSuccess() {
        return "Payment successful";
    }

    @GetMapping("/cancel")
    public String cancel() {
        return "Payment canceled";
    }
}