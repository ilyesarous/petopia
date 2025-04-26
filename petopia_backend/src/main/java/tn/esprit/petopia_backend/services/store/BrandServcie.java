package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.entities.store.Brand;
import tn.esprit.petopia_backend.repositories.store.BrandRepository;
import tn.esprit.petopia_backend.services.store.interfaces.IBrandService;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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
    public Brand addBrand(MultipartFile file, Brand brand) {
        try {
            // Handle file upload
            if (file != null && !file.isEmpty()) {
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                // You might want to generate a unique filename
                String uniqueFileName = System.currentTimeMillis() + "_" + fileName;

                // Save the file to a directory (create this directory if it doesn't exist)
                String uploadDir = "petopia_frontend/src/assets/images/store/brands/";
                Path uploadPath = Paths.get(uploadDir);

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                try (InputStream inputStream = file.getInputStream()) {
                    Path filePath = uploadPath.resolve(uniqueFileName);
                    Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                    brand.setImage("assets/images/store/brands/" + uniqueFileName); // Store the filename in the database
                } catch (IOException e) {
                    throw new RuntimeException("Could not save file: " + uniqueFileName, e);
                }
            }
            return brandRepository.save(brand);
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    @Override
    public void deleteBrandById(int id) {
        brandRepository.deleteById(id);
    }
}
