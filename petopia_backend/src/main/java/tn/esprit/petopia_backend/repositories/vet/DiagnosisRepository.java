package tn.esprit.petopia_backend.repositories.vet;

import org.springframework.data.repository.CrudRepository;
import tn.esprit.petopia_backend.entities.vet.Diagnosis;

import java.util.List;

public interface DiagnosisRepository extends CrudRepository<Diagnosis, Integer> {
    List<Diagnosis> findByPetdiagnosis_IdPet(int idPet);}
