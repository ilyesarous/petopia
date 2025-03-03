package tn.esprit.petopia_backend.repositories.vet;

import org.springframework.data.repository.CrudRepository;
import tn.esprit.petopia_backend.entities.vet.Diagnosis;

public interface DiagnosisRepository extends CrudRepository<Diagnosis, Integer> {
}
