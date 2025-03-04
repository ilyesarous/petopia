package tn.esprit.petopia_backend.repositories.vet;

import org.springframework.data.repository.CrudRepository;
import tn.esprit.petopia_backend.entities.vet.Pet_Growth;

public interface PetGrowthRepository extends CrudRepository<Pet_Growth, Integer> {
}
