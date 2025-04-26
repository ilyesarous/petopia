package tn.esprit.petopia_backend.services.store.interfaces;

import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.entities.store.Brand;

import java.util.List;

public interface IBrandService {
    Brand getBrandById(int id);
    List<Brand> getAllBrands();
    Brand addBrand(MultipartFile file, Brand brand);
    void deleteBrandById(int id);
}
