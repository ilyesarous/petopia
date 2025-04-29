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
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import tn.esprit.petopia_backend.services.store.interfaces.ICartProductService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CartProductService implements ICartProductService {
    private final ProductRepository productRepository;
    private UserRepository userRepository;
    private ProductService productService;
    private CartProductRepository cartProductRepository;
    private CartRepository cartRepository;

    @Override
    public CartProduct getCartProduct(Cart cart, int productId) {
        return cart.getCartProducts().stream()
                .filter(cp -> cp.getProduct().getProduct_id() == productId)
                .findFirst()
                .orElse(null);
    }

    @Override
    public void increaseQuantity(Cart cart, int productId, int quantity) {
        Product product = productService.findById(productId);
        CartProduct cartProduct = getCartProduct(cart, productId);
        if (cartProduct != null) {
            cartProduct.setQuantity(cartProduct.getQuantity() + quantity);
        } else {
            cartProduct = new CartProduct();
            cartProduct.setCart(cart);
            cartProduct.setProduct(product);
            cartProduct.setQuantity(quantity);
            cartProduct.setCreatedAt(LocalDateTime.now());
            cart.getCartProducts().add(cartProduct);
        }
        cartProduct.setTotal(product.getProduct_price() * cartProduct.getQuantity());
        cartProductRepository.save(cartProduct);
        productService.decreaseAvailableQuantity(productId, quantity);
    }

    @Override
    public void decreaseQuantity(Cart cart, int productId) {
        Product product = productService.findById(productId);
        CartProduct cartProduct = getCartProduct(cart, productId);
        if (cartProduct != null) {
            cartProduct.setQuantity(cartProduct.getQuantity() - 1);
        } else {
            throw new RuntimeException("Product not found");
        }
        cartProduct.setTotal(cartProduct.getTotal() - product.getProduct_price());
        productService.increaseAvailableQuantity(productId, 1);
    }

    public List<Product> getTopProducts() {
        return productRepository.findAll()
                .stream()
                .sorted((c1, c2) -> c2.getQuantity() - c1.getQuantity())
                .limit(4)
                .collect(Collectors.toList());
    }
    public List<Product> getTopProductsByUserId(int idUser) {
        User user = userRepository.findById(idUser).get();
        return productRepository.findByUser(user)
                .stream()
                .sorted((c1, c2) -> c2.getQuantity() - c1.getQuantity())
                .limit(4)
                .collect(Collectors.toList());
    }

    public Double getTotalSalesByUser(int idUser) {
        User user = userRepository.findById(idUser).get();
        List<Product> products = productRepository.findByUser(user);
        double total = 0;
        for (Product product : products) {
            total += product.getProduct_price()*product.getQuantity();
        }
        return total;
    }

    public int getTotalSales(int idUser) {
        User user = userRepository.findById(idUser).get();
        List<Product> products = productRepository.findByUser(user);
        int total = 0;
        for (Product product : products) {
            total += product.getQuantity();
        }
        return total;
    }

    public Float getTotalSalesByProductId(int idProduct) {
        Product product = productService.findById(idProduct);
        return product.getProduct_price()*product.getQuantity();
    }
}
