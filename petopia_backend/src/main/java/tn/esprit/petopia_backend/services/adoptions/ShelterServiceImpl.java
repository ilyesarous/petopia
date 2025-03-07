package tn.esprit.petopia_backend.services.adoptions;


import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.adoptions.Shelter;
import tn.esprit.petopia_backend.repositories.adoptions.ShelterRepository;
import tn.esprit.petopia_backend.services.adoptions.IShelterService;
import java.util.List;

@Service
public class ShelterServiceImpl implements IShelterService {

    private final ShelterRepository shelterRepository;

    public ShelterServiceImpl(ShelterRepository shelterRepository) {
        this.shelterRepository = shelterRepository;
    }

    @Override
    public Shelter createShelter(Shelter shelter) {
        return shelterRepository.save(shelter);
    }

    @Override
    public Shelter updateShelter(Shelter shelter) {
        return shelterRepository.save(shelter);
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
