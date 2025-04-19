package tn.esprit.petopia_backend.services.store;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.entities.store.Brand;
import tn.esprit.petopia_backend.entities.store.Feedback;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.store.BrandRepository;
import tn.esprit.petopia_backend.repositories.store.ProductRepository;
import tn.esprit.petopia_backend.services.store.interfaces.IProductService;
import tn.esprit.petopia_backend.services.user.UserService;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductService implements IProductService {
    private ProductRepository repository;
    private BrandRepository brandRepository;
    private UserService userService;

    @Override
    public Product addProduct(MultipartFile file, Product product) {
        try {
            // Handle file upload
            if (file != null && !file.isEmpty()) {
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                // You might want to generate a unique filename
                String uniqueFileName = System.currentTimeMillis() + "_" + fileName;

                // Save the file to a directory (create this directory if it doesn't exist)
                String uploadDir = "petopia_frontend/src/assets/images/store/product";
                Path uploadPath = Paths.get(uploadDir);

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                try (InputStream inputStream = file.getInputStream()) {
                    Path filePath = uploadPath.resolve(uniqueFileName);
                    Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                    product.setProduct_image("assets/images/store/product/" + uniqueFileName); // Store the filename in the database
                } catch (IOException e) {
                    throw new RuntimeException("Could not save file: " + uniqueFileName, e);
                }
            }

            // Set user and brand (as you already have)
            User user = userService.getUsersById(product.getUser().getId_user()).getOurUsers();
            Brand brand = brandRepository.findById(2).get();
            if (user == null) {
                throw new RuntimeException("User not found");
            }
            product.setUser(user);
            product.setBrand(brand);

            return repository.save(product);
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    @Override
    public Product findById(int id) {
        if (repository.findById(id).isEmpty())
            throw new RuntimeException("Product not found");
        return repository.findById(id).get();
    }

    @Override
    public List<Product> findProductsById(int idUser) {
        User user = userService.getUsersById(idUser).getOurUsers();
        if (repository.findByUser(user).isEmpty())
            throw new RuntimeException("Product not found");
        return repository.findByUser(user).stream().sorted((p1, p2) -> p2.getQuantity() - p1.getQuantity()).collect(Collectors.toList());
    }

    @Override
    public void deleteById(int id) {
        repository.deleteById(id);
    }

    @Override
    public Product updateProduct(MultipartFile file, Product product) {
        try {
            // Handle file upload
            if (file != null && !file.isEmpty()) {
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                // You might want to generate a unique filename
                String uniqueFileName = System.currentTimeMillis() + "_" + fileName;

                // Save the file to a directory (create this directory if it doesn't exist)
                String uploadDir = "petopia_frontend/src/assets/images/store/product";
                Path uploadPath = Paths.get(uploadDir);

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                try (InputStream inputStream = file.getInputStream()) {
                    Path filePath = uploadPath.resolve(uniqueFileName);
                    Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
                    product.setProduct_image("assets/images/store/product/" + uniqueFileName); // Store the filename in the database
                } catch (IOException e) {
                    throw new RuntimeException("Could not save file: " + uniqueFileName, e);
                }
            }
            Brand brand = brandRepository.findById(2).get();
            product.setBrand(brand);
            return repository.save(product);
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    @Override
    public Product updateLikedStatus(int idProduct) {
        Product product = findById(idProduct);
        boolean status = !product.isLiked();
        product.setLiked(status);
        return repository.save(product);
    }

    public void decreaseAvailableQuantity(int idProduct, int quantity) {
        if (repository.findById(idProduct).isEmpty())
            throw new RuntimeException("Product not found");
        Product product = repository.findById(idProduct).get();
        if (product.getAvailableQuantity() - quantity <= 0)
            throw new RuntimeException("not enough quantity available");
        product.setAvailableQuantity(product.getAvailableQuantity() - quantity);
        repository.save(product);
    }

    public void increaseAvailableQuantity(int idProduct, int quantity) {
        if (repository.findById(idProduct).isEmpty())
            throw new RuntimeException("Product not found");
        Product product = repository.findById(idProduct).get();
        product.setAvailableQuantity(product.getAvailableQuantity() + quantity);
        repository.save(product);
    }

    @Override
    public List<Product> findAll() {
        return repository.findAll();
    }

    public float getAvrageRatingByUser(int idUser) {
        List<Product> products = findProductsById(idUser);
        float avgRating = 0;
        for (Product product : products) {
            avgRating += product.getRating();
        }
        return avgRating / products.size();
    }
}
