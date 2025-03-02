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
    private CartProductRepository cartProductRepository;
    private ProductService productService;

    @Override
    public Cart addProductToCart(int idCart, int productId, int quantity) {
        Cart cart = repository.findById(idCart).orElse(new Cart());
        Product product = productService.findById(productId);
        CartProduct cartProduct = cart.getCartProducts().stream()
                .filter(cp -> cp.getProduct().getProduct_id()== productId)
                .findFirst()
                .orElse(null);

        if (cartProduct != null) {
            cartProduct.setQuantity(cartProduct.getQuantity() + quantity);
        } else {
            cartProduct = new CartProduct();
            cartProduct.setCart(cart);
            cartProduct.setProduct(product);
            cartProduct.setQuantity(quantity);
            cart.getCartProducts().add(cartProduct);
        }
        productService.updateAvailableQuantity(productId, quantity);
        cart.setTotal_price(cart.getTotal_price() + (product.getProduct_price() * quantity));

        return repository.save(cart);
    }

    @Override
    public Cart findById(int id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public void deleteProductById(int idCart, int idProduct) {
        Cart cart = repository.findById(idCart).get();
        Product product = productService.findById(idProduct);

        CartProduct cartProduct = cart.getCartProducts().stream()
                .filter(cp -> cp.getProduct().getProduct_id()== idProduct)
                .findFirst()
                .get();
        if (cartProduct.getQuantity() > 0) {
            cartProduct.setQuantity(cartProduct.getQuantity() - 1);
            for(CartProduct cp : cart.getCartProducts()) {
                if (cp.getId() == cartProduct.getId()) {
                    cp = cartProduct;
                }
            }
        }else{
            cart.getCartProducts().remove(cartProduct);
            cartProductRepository.deleteById(cartProduct.getId());
        }
        cart.setTotal_price(cart.getTotal_price() - product.getProduct_price());
        repository.save(cart);
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