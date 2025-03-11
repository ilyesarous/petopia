package tn.esprit.petopia_backend.services.payment;

import tn.esprit.petopia_backend.entities.payment.PaymentRequest;

public interface IPaymentService {
    PaymentRequest savePayment(PaymentRequest paymentRequest);
}
