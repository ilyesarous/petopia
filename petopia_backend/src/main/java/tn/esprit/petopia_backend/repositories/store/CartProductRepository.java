package tn.esprit.petopia_backend.repositories.store;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.store.CartProduct;

import java.util.List;

@Repository
public interface CartProductRepository extends JpaRepository<CartProduct, Integer> {
    @Query("SELECT cp FROM CartProduct cp WHERE cp.product.user.id_user = :userId")
    List<CartProduct> findByProductUserId(@Param("userId") Integer userId);
}
