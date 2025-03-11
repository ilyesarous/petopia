package tn.esprit.petopia_backend.repositories.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.payment.PaymentRequest;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentRequest, Integer> {
}
