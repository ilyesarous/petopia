package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.store.Cart;
import tn.esprit.petopia_backend.entities.store.CartProduct;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.store.CartProductRepository;
import tn.esprit.petopia_backend.repositories.store.CartRepository;
import tn.esprit.petopia_backend.services.store.interfaces.ICartService;
import tn.esprit.petopia_backend.services.user.UserService;

import java.util.List;

@Service
@AllArgsConstructor
public class CartService implements ICartService {
    private CartRepository repository;
    private CartProductService cartProductService;
    private ProductService productService;
    private UserService userService;

    @Override
    public Cart findCartByUser(int idUser) {
        User user = userService.getUsersById(idUser).getOurUsers();
        return repository.findCartByUser(user);
    }

    @Override
    public Cart addProductToCart(int idUser, int productId, int quantity) {
        Cart cart = findCartByUser(idUser);
        if (cart == null) {
            cart = new Cart();
            cart.setUser(userService.getUsersById(idUser).getOurUsers());
        }
        Product product = productService.findById(productId);
        cartProductService.increaseQuantity(cart, productId, quantity);
        cart.setTotal_price(cart.getTotal_price() + (product.getProduct_price() * quantity));

        return repository.save(cart);
    }
//TODO: add total to cartProduct, create cartProductService


    @Override
    public void deleteProductById(int idUser, int idProduct) {
        Cart cart = findCartByUser(idUser);
        Product product = productService.findById(idProduct);
        cartProductService.decreaseQuantity(cart, idProduct);
        cart.setTotal_price(cart.getTotal_price() - product.getProduct_price());
        repository.save(cart);
    }

    @Override
    public String checkout(int idUser) {
        Cart cart = findCartByUser(idUser);
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