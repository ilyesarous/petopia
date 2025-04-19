package tn.esprit.petopia_backend.services.event;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;

import java.util.UUID;

@Service
public class ImageStorageService {


    @Value("${image.upload.directory}")
    private String uploadDirectory;

    public String storeImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to store empty file.");
        }

        // Create event subdirectory path
        Path eventUploadPath = Paths.get(uploadDirectory, "event");

        // Generate unique filename
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        // Create directory if it doesn't exist
        if (!Files.exists(eventUploadPath)) {
            Files.createDirectories(eventUploadPath);
        }

        // Save file
        Path filePath = eventUploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        // Return path including the event subdirectory
        return "event/" + filename;
    }

    public byte[] loadImage(String filename) throws IOException {
        // Handle paths with or without "event/" prefix
        String relativePath = filename.startsWith("event/") ? filename : "event/" + filename;
        Path filePath = Paths.get(uploadDirectory).resolve(relativePath);
        return Files.readAllBytes(filePath);
    }
}
