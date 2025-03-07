package tn.esprit.petopia_backend.services.adoptions;


import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.adoptions.Adoption;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionStatus;
import tn.esprit.petopia_backend.repositories.adoptions.AdoptionRepository;
import tn.esprit.petopia_backend.services.adoptions.IAdoptionService;
import java.util.List;

@Service
public class AdoptionServiceImpl implements IAdoptionService {

    private final AdoptionRepository adoptionRepository;

    public AdoptionServiceImpl(AdoptionRepository adoptionRepository) {
        this.adoptionRepository = adoptionRepository;
    }

    @Override
    public Adoption createAdoption(Adoption adoption) {
        return adoptionRepository.save(adoption);
    }

    @Override
    public Adoption updateAdoption(Adoption adoption) {
        return adoptionRepository.save(adoption);
    }

    @Override
    public void deleteAdoption(Integer id) {
        adoptionRepository.deleteById(id);
    }

    @Override
    public Adoption getAdoptionById(Integer id) {
        return adoptionRepository.findById(id).orElse(null);
    }

    @Override
    public List<Adoption> getAllAdoptions() {
        return adoptionRepository.findAll();
    }

    @Override
    public List<Adoption> getAdoptionsByRequesterId(Integer requesterId) {
        return adoptionRepository.findByRequesterId(requesterId);
    }

    @Override
    public List<Adoption> getAdoptionsByShelterId(Integer shelterId) {
        return adoptionRepository.findByShelterId(shelterId);
    }

    @Override
    public List<Adoption> getAdoptionsByPetId(Integer petId) {
        return adoptionRepository.findByPetId(petId);
    }

    @Override
    public List<Adoption> getAdoptionsByStatus(AdoptionStatus status) {
        return adoptionRepository.findByStatus(status);
    }
}
