package tn.esprit.petopia_backend.entities.store;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.user.User;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int product_id;
    private String product_image;
    private String product_name;
    private String product_description;
    private float product_price;
    @Enumerated(EnumType.STRING)
    private ProductCategory category;
    private boolean isLiked;
    private int availableQuantity;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<CartProduct> cartProducts = new ArrayList<>();
}
