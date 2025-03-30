package tn.esprit.petopia_backend.controller.store;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.services.store.ProductService;

import java.util.List;

@RestController
@AllArgsConstructor
public class ProductController {
    private ProductService productService;

    @GetMapping("partner/product/get/{id}")
    public List<Product> findAllById(@PathVariable int id) {
        return productService.findProductsById(id);
    }

    @GetMapping("user/product")
    public Page<Product> findAll(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "5") int size) {
        return productService.findAll(page, size);
    }

    @GetMapping("user/product/{id}")
    public Product findById(@PathVariable int id) {
        return productService.findById(id);
    }

    @PostMapping("partner/product/add")
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @PostMapping("user/product/add")
    public Product addProductSecondHand(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @PutMapping("partner/product/update")
    public Product updateProduct(@RequestBody Product product) {
        return productService.updateProduct(product);
    }

    @DeleteMapping("partner/product/delete/{id}")
    public void deleteProduct(@PathVariable int id) {
        productService.deleteById(id);
    }
}
