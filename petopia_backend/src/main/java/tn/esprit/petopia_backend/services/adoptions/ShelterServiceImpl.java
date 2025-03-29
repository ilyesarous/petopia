package tn.esprit.petopia_backend.services.adoptions;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.adoptions.Shelter;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.adoptions.ShelterRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import tn.esprit.petopia_backend.services.adoptions.IShelterService;
import java.util.List;

@Service
public class ShelterServiceImpl implements IShelterService {

    private final ShelterRepository shelterRepository;
    private final UserRepository userRepository;

    public ShelterServiceImpl(ShelterRepository shelterRepository, UserRepository userRepository) {
        this.shelterRepository = shelterRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public Shelter createShelter(Shelter shelter, Integer userIdFromToken) {
        User managedUser = userRepository.findById(userIdFromToken)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (managedUser.getShelter() != null) {
            throw new RuntimeException("User already has a shelter. Update the existing one instead.");
        }

        Shelter savedShelter = shelterRepository.save(shelter);

        savedShelter.setUser(managedUser);
        managedUser.setShelter(savedShelter);

        userRepository.save(managedUser);

        return savedShelter;
    }



    @Override
    @Transactional
    public Shelter updateShelter(Shelter shelter) {
        Shelter existingShelter = shelterRepository.findById(shelter.getId_shelter())
                .orElseThrow(() -> new RuntimeException("Shelter not found"));

        if (shelter.getUser() == null) {
            shelter.setUser(existingShelter.getUser());
        }

        if (shelter.getShelter_name() != null) {
            existingShelter.setShelter_name(shelter.getShelter_name());
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

        return shelterRepository.save(existingShelter);
    }


    @Override
    public void deleteShelter(Integer id) {
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
