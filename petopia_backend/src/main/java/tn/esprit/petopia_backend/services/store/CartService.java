package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.store.Cart;
import tn.esprit.petopia_backend.entities.store.CartProduct;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.store.CartProductRepository;
import tn.esprit.petopia_backend.repositories.store.CartRepository;
import tn.esprit.petopia_backend.repositories.store.ProductRepository;
import tn.esprit.petopia_backend.services.store.interfaces.ICartService;
import tn.esprit.petopia_backend.services.user.UserService;

import java.util.List;

@Service
@AllArgsConstructor
public class CartService implements ICartService {
    private final ProductRepository productRepository;
    private CartRepository repository;
    private CartProductService cartProductService;
    private ProductService productService;
    private UserService userService;

    @Override
    public Cart findCartByUser(int idUser) {
        User user = userService.getUsersById(idUser).getOurUsers();
        return repository.findCartByUser(user);
    }

    public int getNbItems(int idUser) {
        Cart cart = findCartByUser(idUser);
        return cart.getCartProducts().size();
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

    @Override
    public Cart decreaseProductQuantityById(int idUser, int idProduct) {
        Cart cart = findCartByUser(idUser);
        Product product = productService.findById(idProduct);
        cartProductService.decreaseQuantity(cart, idProduct);
        cart.setTotal_price(cart.getTotal_price() - product.getProduct_price());
        return repository.save(cart);
    }
    @Override
    public Cart increaseProductQuantityById(int idUser, int idProduct) {
        Cart cart = findCartByUser(idUser);
        Product product = productService.findById(idProduct);
        cartProductService.increaseQuantity(cart, idProduct, 1);

        cart.setTotal_price(cart.getTotal_price() + product.getProduct_price());

        return repository.save(cart);
    }

    @Override
    public void clearCart(int idUser){
        Cart cart = findCartByUser(idUser);
        for (CartProduct cp : cart.getCartProducts()){
            cp.getProduct().setAvailableQuantity(cp.getProduct().getAvailableQuantity() + cp.getQuantity());
        }
        cart.setTotal_price(0);
        cart.getCartProducts().clear();
        repository.save(cart);
    }
    @Override
    public Cart removeItem(int idUser, int idProduct){
        Cart cart = findCartByUser(idUser);
        for (CartProduct cp : cart.getCartProducts()){
            if (cp.getProduct().getProduct_id() == idProduct){
                cp.getProduct().setAvailableQuantity(cp.getProduct().getAvailableQuantity() + cp.getQuantity());
                cart.setTotal_price(cart.getTotal_price() - (cp.getProduct().getProduct_price()*cp.getQuantity()));
                cart.getCartProducts().remove(cp);
                return repository.save(cart);
            }
        }
        return cart;
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