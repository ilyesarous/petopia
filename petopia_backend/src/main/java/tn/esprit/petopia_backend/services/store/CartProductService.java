package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.store.Cart;
import tn.esprit.petopia_backend.entities.store.CartProduct;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.repositories.store.CartProductRepository;
import tn.esprit.petopia_backend.services.store.interfaces.ICartProductService;

@Service
@AllArgsConstructor
public class CartProductService implements ICartProductService {
    private ProductService productService;

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
            cart.getCartProducts().add(cartProduct);
        }
        cartProduct.setTotal(product.getProduct_price() * cartProduct.getQuantity());
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
}
