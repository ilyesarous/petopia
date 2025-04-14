package tn.esprit.petopia_backend.controller.store;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.store.AddToCart;
import tn.esprit.petopia_backend.entities.store.Cart;
import tn.esprit.petopia_backend.entities.store.CartProduct;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.services.store.CartProductService;
import tn.esprit.petopia_backend.services.store.CartService;

import java.util.List;

@RestController
@RequestMapping("user/cart")
@AllArgsConstructor
public class CartController {
    private CartService cartService;

    @GetMapping
    public List<Cart> findAll() {
        return cartService.findAll();
    }

    @GetMapping("{id}")
    public Cart findById(@PathVariable int id) {
        return cartService.findCartByUser(id);
    }

    @PostMapping("add")
    public Cart addCart(@RequestBody AddToCart addToCart) {
        return cartService.addProductToCart(addToCart.getId_user(), addToCart.getIdProduct(), addToCart.getQuantity());
    }

    @GetMapping("/checkout")
    public String checkout(@RequestBody int idUser) {
        return cartService.checkout(idUser);
    }

    @PutMapping("update")
    public Cart updateCart(@RequestBody Cart cart) {
        return cartService.updateCart(cart);
    }

    @PutMapping("increase")
    public Cart increaseProductQuantity(@RequestBody AddToCart addToCart) {
         return cartService.increaseProductQuantityById(addToCart.getId_user(), addToCart.getIdProduct());
    }
    @PutMapping("decrease")
    public Cart decreaseProductQuantity(@RequestBody AddToCart addToCart) {
        return cartService.decreaseProductQuantityById(addToCart.getId_user(), addToCart.getIdProduct());
    }
    @DeleteMapping("clear/{idUser}")
    public void clearCart(@PathVariable int idUser) {
        cartService.clearCart(idUser);
    }

    @DeleteMapping("delete/{idUser}/{idProduct}")
    public Cart removeItemFromCart(@PathVariable int idUser, @PathVariable int idProduct) {
        return cartService.removeItem(idUser, idProduct);
    }

    @GetMapping("topProduct")
    public List<Product> getTopProducts() {
        return cartService.getBestSaledProducts();
    }
}
