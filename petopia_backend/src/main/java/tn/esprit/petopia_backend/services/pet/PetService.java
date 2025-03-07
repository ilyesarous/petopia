package tn.esprit.petopia_backend.services.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.repositories.pet.PetRepository;

@Service
public class PetService {

    @Autowired
    private final PetRepository petRepository ;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }
    public Pet addPet(Pet pet) {
        return petRepository.save(pet);
    }
    public Pet updatePet(Pet pet) {
        return petRepository.save(pet);
    }



}