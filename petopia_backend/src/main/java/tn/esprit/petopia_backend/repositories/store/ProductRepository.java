package tn.esprit.petopia_backend.repositories.store;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.entities.user.User;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByUser(User user);
}
