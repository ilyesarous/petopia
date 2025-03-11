package tn.esprit.petopia_backend.entities.payment;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.user.User;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private Double amount; // Montant en dinars tunisiens (par exemple, 30.0 pour 30 TND)
    private String currency; // Devise (par exemple, "tnd")
    @Enumerated(EnumType.STRING)
    private TypePayment type;
    private String description;// Description du produit
    @Temporal(TemporalType.TIMESTAMP)
    private Date paymentDate;

    @ManyToOne
    private User user;

    // Getters et Setters
    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
