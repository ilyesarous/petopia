package tn.esprit.petopia_backend.repositories.pet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.pet.Pet;

@Repository
public interface PetRepository extends JpaRepository<Pet,Integer>
{

}