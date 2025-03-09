package tn.esprit.petopia_backend.services.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.vet.Pet_Growth;
import tn.esprit.petopia_backend.repositories.pet.PetRepository;
import tn.esprit.petopia_backend.repositories.vet.PetGrowthRepository;

import java.util.List;

@Service
public class PetGrowthServiceImplement implements IPetGrowthService {

    @Autowired
    private PetGrowthRepository petGrowthRepository;
    @Autowired
    private PetRepository petRepository;  // Pour récupérer le Pet

    //    @Override
//    public Pet_Growth addPetGrowth(Pet_Growth petGrowth) {
//        return petGrowthRepository.save(petGrowth);
//    }
    @Override
    public Pet_Growth addPetGrowth(Pet_Growth petGrowth) {
        if (petGrowth.getPetgrowth() == null || petGrowth.getPetgrowth().getIdPet() == 0) {
            throw new RuntimeException("Pet ID is required");
        }

        Pet pet = petRepository.findById(petGrowth.getPetgrowth().getIdPet())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        petGrowth.setPetgrowth(pet);  // Associer le Pet à Pet_Growth

        return petGrowthRepository.save(petGrowth);
    }

    @Override
    public Pet_Growth updatePetGrowth(Pet_Growth petGrowth) {
        return petGrowthRepository.save(petGrowth);
    }

    @Override
    public void deletePetGrowth(int idPet_Growth) {
        petGrowthRepository.deleteById(idPet_Growth);
    }

    @Override
    public List<Pet_Growth> retrieveAllPetGrowths() {
        return (List<Pet_Growth>) petGrowthRepository.findAll();
    }

    @Override
    public Pet_Growth retrievePetGrowth(int idPet_Growth) {
        return petGrowthRepository.findById(idPet_Growth).orElse(null);
    }
}
