package tn.esprit.petopia_backend.services.adoptions;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.adoptions.Adoption;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionStatus;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.adoptions.AdoptionRepository;
import tn.esprit.petopia_backend.repositories.pet.PetRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import tn.esprit.petopia_backend.services.adoptions.IAdoptionService;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdoptionServiceImpl implements IAdoptionService {

    private final AdoptionRepository adoptionRepository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;
    public AdoptionServiceImpl(AdoptionRepository adoptionRepository,UserRepository userRepository,PetRepository petRepository) {
        this.adoptionRepository = adoptionRepository;
        this.userRepository = userRepository;
        this.petRepository = petRepository;
    }
    @Override
    @Transactional
    public Adoption createAdoption(Adoption adoption, Integer userIdFromToken) {
        // Retrieve the managed User from the DB.
        User requester = userRepository.findById(userIdFromToken)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Retrieve the pet entity from DB to ensure consistency.
        Pet pet = petRepository.findSimplePetById(adoption.getPet().getIdPet())
                .orElseThrow(() -> new RuntimeException("Pet not found"));


        // Automatically set the requester, pet, shelter, status, and request date.
        adoption.setRequester(requester);
        adoption.setPet(pet);
        adoption.setShelter(pet.getShelter());
        adoption.setStatus(AdoptionStatus.PENDING);
        adoption.setRequest_date(LocalDateTime.now());

        return adoptionRepository.save(adoption);
    }


    @Override
    @Transactional
    public Adoption updateAdoption(Integer id, Adoption adoption) {
        Adoption existingAdoption = adoptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adoption request not found"));

        if (adoption.getStatus() != null)
            existingAdoption.setStatus(adoption.getStatus());

        if (adoption.getMotivation_letter() != null)
            existingAdoption.setMotivation_letter(adoption.getMotivation_letter());

        if (adoption.getCinimage() != null)
            existingAdoption.setCinimage(adoption.getCinimage());

        if (adoption.getPet() != null && adoption.getPet().getIdPet() != 0) {
            Pet pet = petRepository.findById(adoption.getPet().getIdPet())
                    .orElseThrow(() -> new RuntimeException("Pet not found"));
            existingAdoption.setPet(pet);
            existingAdoption.setShelter(pet.getShelter());
        }
        return adoptionRepository.save(existingAdoption);
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
