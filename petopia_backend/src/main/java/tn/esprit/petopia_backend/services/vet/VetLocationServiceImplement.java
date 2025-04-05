package tn.esprit.petopia_backend.services.vet;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.entities.vet.VetLocation;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import tn.esprit.petopia_backend.repositories.vet.VetLocationRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class VetLocationServiceImplement implements VetLocationService {

    private final VetLocationRepository vetLocationRepository;
    private final UserRepository userRepository;

    @Override
    public VetLocation saveLocation(VetLocation location) {
        return vetLocationRepository.save(location);
    }

    @Override
    public List<VetLocation> getLocationsByVet(Integer vetId) {
        return vetLocationRepository.findByVetId(vetId);
    }

    @Override
    public List<VetLocation> getAllLocations() {
        return vetLocationRepository.findAll();
    }

    @Override
    public void deleteLocation(Long id) {
        vetLocationRepository.deleteById(id);
    }
}
