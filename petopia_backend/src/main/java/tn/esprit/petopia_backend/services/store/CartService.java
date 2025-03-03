package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.store.Cart;
import tn.esprit.petopia_backend.entities.store.CartProduct;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.repositories.store.CartProductRepository;
import tn.esprit.petopia_backend.repositories.store.CartRepository;
import tn.esprit.petopia_backend.services.store.interfaces.ICartService;

import java.util.List;

@Service
@AllArgsConstructor
public class CartService implements ICartService {
    private CartRepository repository;
    private CartProductService cartProductService;
    private ProductService productService;

    @Override
    public Cart addProductToCart(int idCart, int productId, int quantity) {
        Cart cart = repository.findById(idCart).orElse(new Cart());
        Product product = productService.findById(productId);
        cartProductService.increaseQuantity(cart, productId, quantity);
        cart.setTotal_price(cart.getTotal_price() + (product.getProduct_price() * quantity));

        return repository.save(cart);
    }
//TODO: add total to cartProduct, create cartProductService
    @Override
    public Cart findById(int id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public void deleteProductById(int idCart, int idProduct) {
        Cart cart = repository.findById(idCart).get();
        Product product = productService.findById(idProduct);
        cartProductService.decreaseQuantity(cart, idProduct);
        cart.setTotal_price(cart.getTotal_price() - product.getProduct_price());
        repository.save(cart);
    }

    @Override
    public String checkout(int idCart) {
        Cart cart = repository.findById(idCart).get();
        return "votre total est: " + cart.getTotal_price();
    }

    @Override
    public Cart updateCart(Cart cart) {
        return repository.save(cart);
    }

    @Override
    public List<Cart> findAll() {
        return repository.findAll();
    }
}