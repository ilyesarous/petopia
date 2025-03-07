package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.store.ProductRepository;
import tn.esprit.petopia_backend.services.store.interfaces.IProductService;
import tn.esprit.petopia_backend.services.user.UserService;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductService implements IProductService {
    private ProductRepository repository;
    private UserService userService;

    @Override
    public Product addProduct(Product product) {
        return repository.save(product);
    }

    @Override
    public Product findById(int id) {
        if (repository.findById(id).isEmpty())
            throw new RuntimeException("Product not found");
        return repository.findById(id).get();
    }
    @Override
    public List<Product> findProductsById(int idUser) {
        User user = userService.getUsersById(idUser).getOurUsers();
        if (repository.findByUser(user).isEmpty())
            throw new RuntimeException("Product not found");
        return repository.findByUser(user);
    }

    @Override
    public void deleteById(int id) {
        repository.deleteById(id);
    }

    @Override
    public Product updateProduct(Product product) {
        return repository.save(product);
    }

    public void decreaseAvailableQuantity(int idProduct, int quantity) {
        if (repository.findById(idProduct).isEmpty())
            throw new RuntimeException("Product not found");
        Product product = repository.findById(idProduct).get();
        if (product.getAvailableQuantity() - quantity <= 0)
            throw new RuntimeException("not enough quantity available");
        product.setAvailableQuantity(product.getAvailableQuantity() - quantity);
        repository.save(product);
    }

    public void increaseAvailableQuantity(int idProduct, int quantity) {
        if (repository.findById(idProduct).isEmpty())
            throw new RuntimeException("Product not found");
        Product product = repository.findById(idProduct).get();
        product.setAvailableQuantity(product.getAvailableQuantity() + quantity);
        repository.save(product);
    }

    @Override
    public List<Product> findAll() {
        return repository.findAll();
    }
}
