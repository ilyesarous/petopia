package tn.esprit.petopia_backend.services.event;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.entities.event.ServiceAnimal;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.event.ServiceAnimalRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import tn.esprit.petopia_backend.services.community.CloudinaryService;
import tn.esprit.petopia_backend.services.user.UserService;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceAnimalImplement implements IServiceAnimalService {
    @Autowired
    private  CloudinaryService cloudinaryService;

    @Autowired
    private ServiceAnimalRepository serviceAnimalRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Override
    public List<ServiceAnimal> getAllServiceAnimals() {
        return serviceAnimalRepository.findAll();
    }

    @Override
    public Optional<ServiceAnimal> getServiceAnimalById(Long id) {
        return serviceAnimalRepository.findById(id);
    }

    @Override
    public ServiceAnimal createServiceAnimal(ServiceAnimal serviceAnimal, Integer userIdFromToken ,MultipartFile logoFile) {
        // Check if organizer is provided
        User managedUser = userRepository.findById(userIdFromToken)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Set default values if needed
        try {
            if (logoFile != null && !logoFile.isEmpty()) {
                String logoUrl = cloudinaryService.uploadImage(logoFile);
                serviceAnimal.setImagePath(logoUrl);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload logo image", e);
        }
        // Get the user (add error handling)

        serviceAnimal.setOrganisateurServiceAnimal(managedUser);

        return serviceAnimalRepository.save(serviceAnimal);


    }

    @Override
    public ServiceAnimal updateServiceAnimal(Long id, ServiceAnimal updatedServiceAnimal) {
        return serviceAnimalRepository.findById(id).map(serviceAnimal -> {
            serviceAnimal.setPrixServiceAnimal(updatedServiceAnimal.getPrixServiceAnimal());
            serviceAnimal.setDescriptionServiceAnimal(updatedServiceAnimal.getDescriptionServiceAnimal());
            serviceAnimal.setDisponibilite(updatedServiceAnimal.isDisponibilite());
            serviceAnimal.setTypeService(updatedServiceAnimal.getTypeService());
            return serviceAnimalRepository.save(serviceAnimal);
        }).orElseThrow(() -> new RuntimeException("ServiceAnimal not found"));
    }


    @Override
    public void deleteServiceAnimal(Long id) {
            serviceAnimalRepository.deleteById(id);
    }
}
