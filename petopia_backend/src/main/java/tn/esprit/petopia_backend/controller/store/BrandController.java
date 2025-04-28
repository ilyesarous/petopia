package tn.esprit.petopia_backend.controller.store;

import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.entities.store.Brand;
import tn.esprit.petopia_backend.services.store.BrandServcie;

import java.util.List;

@RestController
@AllArgsConstructor
public class BrandController {
    private BrandServcie brandServcie;

    @GetMapping("user/brand")
    public List<Brand> getAllBrands() {
        return brandServcie.getAllBrands();
    }
    @GetMapping("admin/brand")
    public List<Brand> getAdminAllBrands() {
        return brandServcie.getAllBrands();
    }
    @GetMapping("partner/brand")
    public List<Brand> getPartnerAllBrands() {
        return brandServcie.getAllBrands();
    }

    @GetMapping("{id}")
    public Brand getBrandById(@PathVariable int id) {
        return brandServcie.getBrandById(id);
    }

    @PostMapping(path = "admin/brand/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Brand addBrand(@RequestParam("image") MultipartFile file,
                          @RequestParam("name") String name) {
        Brand brand = new Brand();
        brand.setName(name);
        return brandServcie.addBrand(file, brand);
    }

    @DeleteMapping("admin/brand/delete/{id}")
    public void deleteBrand(@PathVariable int id) {
        brandServcie.deleteBrandById(id);
    }

}
