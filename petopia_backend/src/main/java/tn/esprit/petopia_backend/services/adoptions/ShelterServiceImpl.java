package tn.esprit.petopia_backend.services.adoptions;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.entities.adoptions.Shelter;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.adoptions.ShelterRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import tn.esprit.petopia_backend.services.adoptions.IShelterService;
import tn.esprit.petopia_backend.services.community.CloudinaryService;

import java.io.IOException;
import java.util.List;

@Service
public class ShelterServiceImpl implements IShelterService {
    private final ShelterRepository shelterRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public ShelterServiceImpl(ShelterRepository shelterRepository, UserRepository userRepository, CloudinaryService cloudinaryService) {
        this.shelterRepository = shelterRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    @Transactional
    public Shelter createShelter(Shelter shelter, Integer userIdFromToken, MultipartFile logoFile) {
        User managedUser = userRepository.findById(userIdFromToken)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (managedUser.getShelter() != null) {
            throw new RuntimeException("User already has a shelter. Update the existing one instead.");
        }

        try {
            if (logoFile != null && !logoFile.isEmpty()) {
                String logoUrl = cloudinaryService.uploadImage(logoFile);
                shelter.setLogoUrl(logoUrl);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload logo image", e);
        }

        Shelter savedShelter = shelterRepository.save(shelter);

        savedShelter.setUser(managedUser);
        managedUser.setShelter(savedShelter);

        userRepository.save(managedUser);

        return savedShelter;
    }

    @Override
    @Transactional
    public Shelter updateShelter(Shelter shelter, Integer userIdFromToken, MultipartFile logoFile) {
        // First validate the shelter exists
        Shelter existingShelter = shelterRepository.findById(shelter.getId_shelter())
                .orElseThrow(() -> new RuntimeException("Shelter not found"));

        if (!existingShelter.getUser().getId_user().equals(userIdFromToken)) {
            throw new RuntimeException("You can only update your own shelter.");
        }

        if (shelter.getShelter_name() != null) {
            existingShelter.setShelter_name(shelter.getShelter_name());
        }
        if(shelter.getLatitude() != 0){
            existingShelter.setLatitude(shelter.getLatitude());
        }
        if(shelter.getLongitude() != 0){
            existingShelter.setLongitude(shelter.getLongitude());
        }
        if (shelter.getLocation() != null) {
            existingShelter.setLocation(shelter.getLocation());
        }
        if (shelter.getEmail() != null) {
            existingShelter.setEmail(shelter.getEmail());
        }
        if (shelter.getPhone_number() != null) {
            existingShelter.setPhone_number(shelter.getPhone_number());
        }
        if (shelter.getDescription() != null) {
            existingShelter.setDescription(shelter.getDescription());
        }
        if (shelter.getWebsite() != null) {
            existingShelter.setWebsite(shelter.getWebsite());
        }

        if (logoFile != null && !logoFile.isEmpty()) {
            try {
                String logoUrl = cloudinaryService.uploadImage(logoFile);
                existingShelter.setLogoUrl(logoUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload logo image", e);
            }
        }

        return shelterRepository.save(existingShelter);
    }


    @Override
    @Transactional
    public void deleteShelter(Integer id) {
        List<User> users = userRepository.findUsersByShelterId(id);
        for (User user : users) {
            user.setShelter(null);
        }
        userRepository.saveAll(users);
        shelterRepository.deleteById(id);
    }

    @Override
    public Shelter getShelterById(Integer id) {
        return shelterRepository.findById(id).orElse(null);
    }

    @Override
    public List<Shelter> getAllShelters() {
        return shelterRepository.findAll();
    }

    @Override
    public Shelter getShelterByUserId(Integer userId) {
        return shelterRepository.findByUserId(userId);
    }
}
