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



    public Pet updatePet(Pet pet) {
        Pet existingPet = petRepository.findById(pet.getIdPet())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        if (pet.getPetName() != null) {
            existingPet.setPetName(pet.getPetName());
        }
        if (pet.getPetAge() > 0) {
            existingPet.setPetAge(pet.getPetAge());
        }
        if (pet.getPetImage() != null) {
            existingPet.setPetImage(pet.getPetImage());
        }
        if (pet.getBreed() != null) {
            existingPet.setBreed(pet.getBreed());
        }
        if (pet.getLocation() != null) {
            existingPet.setLocation(pet.getLocation());
        }
        if (pet.getAttitudeX() != 0) {
            existingPet.setAttitudeX(pet.getAttitudeX());
        }
        if (pet.getAttitudeY() != 0) {
            existingPet.setAttitudeY(pet.getAttitudeY());
        }
        if (pet.getSpecies() != null) {
            existingPet.setSpecies(pet.getSpecies());
        }
        if (pet.getStatus() != null) {
            existingPet.setStatus(pet.getStatus());
        }
        if (pet.getGender() != null) {
            existingPet.setGender(pet.getGender());
        }
        if (pet.getSize() != null) {
            existingPet.setSize(pet.getSize());
        }
        if (pet.getHealthStatus() != null) {
            existingPet.setHealthStatus(pet.getHealthStatus());
        }


        return petRepository.save(existingPet);
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

    public List<Pet> getUnassignedPets() {
        return petRepository.findAllUnassignedPets();
    }



}