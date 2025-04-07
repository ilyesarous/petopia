package tn.esprit.petopia_backend.services.store.interfaces;

import tn.esprit.petopia_backend.entities.store.Cart;
import tn.esprit.petopia_backend.entities.store.Product;

import java.util.List;

public interface ICartService {
    Cart addProductToCart(int idCart, int idProduct, int quantity);
    Cart findCartByUser(int idUser);
    Cart decreaseProductQuantityById(int idCart, int idProduct);
    Cart increaseProductQuantityById(int idUser, int idProduct);
    Cart updateCart(Cart cart);
    List<Cart> findAll();
    String checkout(int idCart);
    void clearCart(int idUser);
    Cart removeItem(int idUser, int idProduct);
}
