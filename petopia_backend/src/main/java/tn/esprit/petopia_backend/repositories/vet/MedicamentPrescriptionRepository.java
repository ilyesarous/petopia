package tn.esprit.petopia_backend.repositories.vet;

import org.springframework.data.repository.CrudRepository;
import tn.esprit.petopia_backend.entities.vet.Medicament_Prescription;

public interface MedicamentPrescriptionRepository extends CrudRepository<Medicament_Prescription, Integer> {
}
