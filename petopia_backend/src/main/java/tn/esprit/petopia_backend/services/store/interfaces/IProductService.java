package tn.esprit.petopia_backend.services.store.interfaces;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tn.esprit.petopia_backend.entities.store.Product;

import java.util.List;

public interface IProductService {
    Product addProduct(Product product);
    List<Product> findProductsById(int idUser);
    Product findById(int id);
    void deleteById(int id);
    Product updateProduct(Product product);
    Page<Product> findAll(int page, int size);
    void decreaseAvailableQuantity(int idProduct, int quantity);
    void increaseAvailableQuantity(int idProduct, int quantity);
}
