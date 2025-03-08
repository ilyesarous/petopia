package tn.esprit.petopia_backend.repositories.store;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.store.Cart;
import tn.esprit.petopia_backend.entities.user.User;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    Cart findCartByUser(User user);
}
