package tn.esprit.petopia_backend.repositories.vet;

import org.springframework.data.repository.CrudRepository;
import tn.esprit.petopia_backend.entities.vet.Pet_Growth;

import java.util.List;

public interface PetGrowthRepository extends CrudRepository<Pet_Growth, Integer> {
    List<Pet_Growth> findByPetgrowth_IdPet(int petId);
}
