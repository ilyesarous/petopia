package tn.esprit.petopia_backend.services.payment;

import tn.esprit.petopia_backend.entities.payment.PaymentRequest;

import java.util.List;

public interface IPaymentService {
    PaymentRequest savePayment(PaymentRequest paymentRequest);
    public List<PaymentRequest> findByUserVetId(Long vetId);
    }
