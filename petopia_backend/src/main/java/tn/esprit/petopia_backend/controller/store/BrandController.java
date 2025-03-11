package tn.esprit.petopia_backend.controller.store;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.store.Brand;
import tn.esprit.petopia_backend.services.store.BrandServcie;

import java.util.List;

@RestController
@RequestMapping("admin/brand")
@AllArgsConstructor
public class BrandController {
    private BrandServcie brandServcie;

    @GetMapping
    public List<Brand> getAllBrands() {
        return brandServcie.getAllBrands();
    }

    @GetMapping("{id}")
    public Brand getBrandById(@PathVariable int id) {
        return brandServcie.getBrandById(id);
    }

    @PostMapping("add")
    public Brand addBrand(@RequestBody Brand brand) {
        return brandServcie.addBrand(brand);
    }

    @DeleteMapping("delete/{id}")
    public void deleteBrand(@PathVariable int id) {
        brandServcie.deleteBrandById(id);
    }

}
