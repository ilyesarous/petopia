package tn.esprit.petopia_backend.repositories.vet;

import org.springframework.data.repository.CrudRepository;
import tn.esprit.petopia_backend.entities.vet.Consultations;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.petopia_backend.entities.pet.Pet;

import java.util.List;

public interface ConsultationsRepository extends CrudRepository<Consultations,Integer> {

    @Query("SELECT DISTINCT c.petconsultation FROM Consultations c WHERE c.uservet.id_user = :vetId")
    List<Pet> findDistinctPetsByVetId(@Param("vetId") Long vetId);

}
