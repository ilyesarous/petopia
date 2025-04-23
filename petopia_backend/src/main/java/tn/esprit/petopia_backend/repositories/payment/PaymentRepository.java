package tn.esprit.petopia_backend.repositories.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.payment.PaymentRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentRequest, Integer> {

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM PaymentRequest p WHERE p.userVet.id_user = :vetId")
    Double calculateTotalRevenueByVetId(@Param("vetId") Long vetId);

    @Query("SELECT p FROM PaymentRequest p WHERE p.userVet.id_user = :vetId")
    List<PaymentRequest> findByUserVetId(@Param("vetId") Long vetId);

}
