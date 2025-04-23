package tn.esprit.petopia_backend.services.store.interfaces;

import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.entities.store.Product;

import java.util.List;

public interface IProductService {
    Product addProduct(MultipartFile file, Product product);
    List<Product> findProductsById(int idUser);
    Product findById(int id);
    void deleteById(int id);
    Product updateProduct(MultipartFile file, Product product);
    Product updateLikedStatus(int idProduct);
    //Page<Product> findAll(int page, int size);
    List<Product> findAll();
    void decreaseAvailableQuantity(int idProduct, int quantity);
    void increaseAvailableQuantity(int idProduct, int quantity);
}
