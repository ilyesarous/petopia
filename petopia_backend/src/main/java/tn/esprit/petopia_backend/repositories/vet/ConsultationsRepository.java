package tn.esprit.petopia_backend.repositories.vet;

import org.springframework.data.repository.CrudRepository;
import tn.esprit.petopia_backend.entities.vet.Consultations;

public interface ConsultationsRepository extends CrudRepository<Consultations,Integer> {
}
