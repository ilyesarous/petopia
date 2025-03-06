package tn.esprit.petopia_backend.controller.store;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.store.Cart;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.services.store.CartService;

import java.util.List;

@RestController
@RequestMapping("cart")
@AllArgsConstructor
public class CartController {
    private CartService cartService;

    @GetMapping
    public List<Cart> findAll() {
        return cartService.findAll();
    }

    @GetMapping("{id}")
    public Cart findById(@PathVariable int id) {
        return cartService.findById(id);
    }

    @PostMapping("add/{idCart}/{idProduct}/{quantity}")
    public Cart addCart(@PathVariable int idProduct, @PathVariable int quantity, @PathVariable int idCart) {
        return cartService.addProductToCart(idCart, idProduct, quantity);
    }

    @GetMapping("/{idCart}/checkout")
    public String checkout(@PathVariable int idCart) {
        return cartService.checkout(idCart);
    }

    @PutMapping("update")
    public Cart updateCart(@RequestBody Cart cart) {
        return cartService.updateCart(cart);
    }

    @DeleteMapping("delete/{idCart}/{idProduct}")
    public void deleteCart(@PathVariable int idCart, @PathVariable int idProduct) {
        cartService.deleteProductById(idCart, idProduct);
    }
}
