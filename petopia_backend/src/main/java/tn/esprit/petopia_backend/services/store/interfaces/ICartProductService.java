package tn.esprit.petopia_backend.services.store.interfaces;

import tn.esprit.petopia_backend.entities.store.Cart;
import tn.esprit.petopia_backend.entities.store.CartProduct;

public interface ICartProductService {
    CartProduct getCartProduct(Cart cart, int productId);
    void decreaseQuantity(Cart cart, int productId);
    void increaseQuantity(Cart cart, int productId, int quantity);
}
