package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.entities.store.Ads;
import tn.esprit.petopia_backend.repositories.store.AdsRepository;
import tn.esprit.petopia_backend.services.store.interfaces.IAdsService;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class AdsService implements IAdsService {

    private AdsRepository adsRepository;

    @Override
    public List<Ads> getAllAds() {
        return adsRepository.findAll();
    }

    @Override
    public Ads addAds(MultipartFile file, Ads ads) {
        try {
            // Handle file upload
            if (file != null && !file.isEmpty()) {
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                // You might want to generate a unique filename
                String uniqueFileName = System.currentTimeMillis() + "_" + fileName;

                // Save the file to a directory (create this directory if it doesn't exist)
                String uploadDir = "petopia_frontend/src/assets/images/store/carousel/";
                Path uploadPath = Paths.get(uploadDir);

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                try (InputStream inputStream = file.getInputStream()) {
                    Path filePath = uploadPath.resolve(uniqueFileName);
                    Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                    ads.setImageUrl("assets/images/store/carousel/" + uniqueFileName); // Store the filename in the database
                } catch (IOException e) {
                    throw new RuntimeException("Could not save file: " + uniqueFileName, e);
                }
            }
            return adsRepository.save(ads);
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    @Override
    public void deleteAds(int adsId) {
        adsRepository.deleteById(adsId);
    }

}
