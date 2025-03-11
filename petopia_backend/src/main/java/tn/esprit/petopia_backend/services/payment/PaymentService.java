package tn.esprit.petopia_backend.services.payment;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.payment.PaymentRequest;
import tn.esprit.petopia_backend.repositories.payment.PaymentRepository;

@Service
@AllArgsConstructor
public class PaymentService implements IPaymentService {
    private PaymentRepository paymentRepository;

    @Override
    public PaymentRequest savePayment(PaymentRequest paymentRequest) {
        return paymentRepository.save(paymentRequest);
    }
}
