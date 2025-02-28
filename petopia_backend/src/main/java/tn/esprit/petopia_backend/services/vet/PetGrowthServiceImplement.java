package tn.esprit.petopia_backend.services.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.vet.Pet_Growth;
import tn.esprit.petopia_backend.repositories.vet.PetGrowthRepository;

import java.util.List;

@Service
public class PetGrowthServiceImplement implements IPetGrowthService {

    @Autowired
    private PetGrowthRepository petGrowthRepository;

    @Override
    public Pet_Growth addPetGrowth(Pet_Growth petGrowth) {
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
