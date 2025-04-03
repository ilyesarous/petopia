package tn.esprit.petopia_backend.services.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.pet.PetStatus;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.pet.PetRepository;

import java.util.List;

@Service
public class PetService {

    @Autowired
    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }
    public List<Pet> getallPets(){
        return petRepository.findAll();
    }


    public Pet addPet(Pet pet) {
        return petRepository.save(pet);
    }


    //AMAL ADDED THIS!!
    public Pet updatePet(Pet pet) {
        if (!petRepository.existsById(pet.getIdPet())) {
            throw new RuntimeException("Pet not found");
        }
        return petRepository.save(pet);
    }

    public Pet getPetById(Integer id) {
        return petRepository.findById(id).orElse(null);
    }

    public void deletePet(Integer id) {
        if (!petRepository.existsById(id)) {
            throw new RuntimeException("Pet not found");
        }
        petRepository.deleteById(id);
    }

    public List<Pet> getPetsByShelterId(Integer shelterId) {
        return petRepository.findByShelterId(shelterId);
    }


    public List<Pet> getPetsByOwnerId(Integer ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    public List<Pet> getPetsByStatus(PetStatus status) {
        return petRepository.findByStatus(status);
    }





}