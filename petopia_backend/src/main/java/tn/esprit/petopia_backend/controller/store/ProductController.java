package tn.esprit.petopia_backend.controller.store;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.entities.store.ProductCategory;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.services.store.ProductService;
import tn.esprit.petopia_backend.services.user.UserService;

import java.util.List;

@RestController
@AllArgsConstructor
public class ProductController {
    private ProductService productService;
    private UserService userService;

    @GetMapping("partner/product/{id}")
    public List<Product> findAllById(@PathVariable int id) {
        return productService.findProductsById(id);
    }

    @GetMapping("user/product")
    public List<Product> findAll() {
        return productService.findAll();
    }

    @GetMapping("user/product/{id}")
    public Product findById(@PathVariable int id) {
        return productService.findById(id);
    }

    @PostMapping(path = "partner/product/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product addProduct(@RequestParam("product_image") MultipartFile file,
                              @RequestParam("product_name") String productName,
                              @RequestParam("product_description") String productDescription,
                              @RequestParam("product_price") float productPrice,
                              @RequestParam("old_price") float oldPrice,
                              @RequestParam("cuppon_price") float cupponPrice,
                              @RequestParam("category") String category,
                              @RequestParam("availableQuantity") int availableQuantity,
                              @RequestParam("id_user") int idUser) {
        int idProduct = 0;
        Product product = getProduct(idProduct, productName, productDescription, productPrice, oldPrice, cupponPrice, category, availableQuantity, idUser);
        return productService.addProduct(file, product);
    }

    @PostMapping(path = "user/product/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product addProductSecondHand(@RequestParam("product_image") MultipartFile file,
                                        @RequestParam("product_name") String productName,
                                        @RequestParam("product_description") String productDescription,
                                        @RequestParam("product_price") float productPrice,
                                        @RequestParam("old_price") float oldPrice,
                                        @RequestParam("cuppon_price") float cupponPrice,
                                        @RequestParam("category") String category,
                                        @RequestParam("availableQuantity") int availableQuantity,
                                        @RequestParam("id_user") int idUser) {
        int idProduct = 0;
        Product product = getProduct(idProduct, productName, productDescription, productPrice, oldPrice, cupponPrice, category, availableQuantity, idUser);
        return productService.addProduct(file, product);
    }

    private Product getProduct(int idProduct, String productName,String productDescription, float productPrice, float oldPrice, float cupponPrice, String category, int availableQuantity, int idUser) {
        Product product = new Product();
        User user = userService.getUsersById(idUser).getOurUsers();
        if (idProduct != 0) {
            product.setProduct_id(idProduct);
            product.setProduct_image(productService.findById(idProduct).getProduct_image());
        }
        product.setProduct_name(productName);
        product.setProduct_description(productDescription);
        product.setProduct_price(productPrice);
        product.setOld_price(oldPrice);
        product.setCuppon_price(cupponPrice);
        product.setCategory(ProductCategory.valueOf(category));
        product.setAvailableQuantity(availableQuantity);
        product.setRating(0); // default values
        product.setReview_count(0);
        product.setLiked(false);
        product.setUser(user);
        return product;
    }

    @PutMapping("partner/product/update")
    public Product updateProduct(@RequestParam("product_image") MultipartFile file,
                                 @RequestParam("product_id") int productId,
                                 @RequestParam("product_name") String productName,
                                 @RequestParam("product_description") String productDescription,
                                 @RequestParam("product_price") float productPrice,
                                 @RequestParam("old_price") float oldPrice,
                                 @RequestParam("cuppon_price") float cupponPrice,
                                 @RequestParam("category") String category,
                                 @RequestParam("availableQuantity") int availableQuantity,
                                 @RequestParam("id_user") int idUser) {
        Product product = getProduct(productId, productName, productDescription, productPrice, oldPrice, cupponPrice, category, availableQuantity, idUser);
        return productService.updateProduct(file, product);
    }

    @PutMapping("user/product/update/{id}")
    public Product updateLikedProduct(@PathVariable int id) {
        return productService.updateLikedStatus(id);
    }

    @DeleteMapping("partner/product/delete/{id}")
    public void deleteProduct(@PathVariable int id) {
        productService.deleteById(id);
    }
}
