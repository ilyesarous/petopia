package tn.esprit.petopia_backend.repositories.reclamation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.reclamation.Reclamation;
@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation,Integer> {
}
