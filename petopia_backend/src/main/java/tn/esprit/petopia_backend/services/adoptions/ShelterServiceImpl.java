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
        // Retrieve the managed User from the DB.
        User managedUser = userRepository.findById(userIdFromToken)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Save the Shelter first. This ensures that Shelter is in a persistent state.
        Shelter savedShelter = shelterRepository.save(shelter);

        // Now update both sides of the relationship.
        savedShelter.setUser(managedUser);
        managedUser.setShelter(savedShelter);

        // Save the updated User so that the association is persisted.
        userRepository.save(managedUser);

        // Optionally, if needed, you can update savedShelter again if your mapping requires it.
        return savedShelter;
    }


    @Override
    @Transactional
    public Shelter updateShelter(Shelter shelter) {
        // Load the existing shelter from the DB
        Shelter existingShelter = shelterRepository.findById(shelter.getId_shelter())
                .orElseThrow(() -> new RuntimeException("Shelter not found"));

        // Preserve the user association if the incoming update has null for user
        if (shelter.getUser() == null) {
            shelter.setUser(existingShelter.getUser());
        }

        // You might also want to update other fields selectively if needed.
        // For example:
        existingShelter.setShelter_name(shelter.getShelter_name());
        existingShelter.setLocation(shelter.getLocation());
        existingShelter.setEmail(shelter.getEmail());
        existingShelter.setPhone_number(shelter.getPhone_number());
        existingShelter.setDescription(shelter.getDescription());
        existingShelter.setWebsite(shelter.getWebsite());
        // Preserve the existing user
        // Optionally update pets if needed

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
