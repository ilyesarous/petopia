package tn.esprit.petopia_backend.services.store.interfaces;

import tn.esprit.petopia_backend.entities.store.Product;

import java.util.List;

public interface IProductService {
    Product addProduct(Product product);
    Product findById(int id);
    void deleteById(int id);
    Product updateProduct(Product product);
    List<Product> findAll();
    void updateAvailableQuantity(int idProduct, int quantity);
}
