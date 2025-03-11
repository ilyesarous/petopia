package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.store.Brand;
import tn.esprit.petopia_backend.repositories.store.BrandRepository;
import tn.esprit.petopia_backend.services.store.interfaces.IBrandService;

import java.util.List;

@Service
@AllArgsConstructor
public class BrandServcie implements IBrandService {

    private BrandRepository brandRepository;

    @Override
    public Brand getBrandById(int id) {
        return brandRepository.findById(id).get();
    }

    @Override
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    @Override
    public Brand addBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    @Override
    public void deleteBrandById(int id) {
        brandRepository.deleteById(id);
    }
}
