package tn.esprit.petopia_backend.entities.store;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SecondHand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int request_id;
    private String product_name;
    private String product_image;
    private ProductCategory category;
    private String product_description;
    private String product_price;

}
