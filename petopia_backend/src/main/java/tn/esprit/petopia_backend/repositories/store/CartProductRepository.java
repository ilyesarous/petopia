package tn.esprit.petopia_backend.repositories.store;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.store.CartProduct;

@Repository
public interface CartProductRepository extends JpaRepository<CartProduct, Integer> {
}
