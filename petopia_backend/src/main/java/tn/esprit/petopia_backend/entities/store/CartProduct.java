package tn.esprit.petopia_backend.entities.store;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JsonIgnore
    private Cart cart;
    @ManyToOne
    private Product product;
    private int quantity;
    private float total;
    private LocalDateTime createdAt;

    @Override
    public String toString() {
        return "CartProduct{" +
                "id=" + id +
                ", quantity=" + quantity +
                ", total=" + total +
                ", createdAt=" + createdAt +
                ", product=" + product.getProduct_id() +
                '}';
    }
}

