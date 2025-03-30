package tn.esprit.petopia_backend.repositories.adoptions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.adoptions.Adoption;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionStatus;
import tn.esprit.petopia_backend.entities.pet.Pet;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdoptionRepository extends JpaRepository<Adoption, Integer> {

    @Query("SELECT a FROM Adoption a WHERE a.requester.id_user = ?1")
    List<Adoption> findByRequesterId(Integer requesterId);

    @Query("SELECT a FROM Adoption a WHERE a.shelter.id_shelter = ?1")
    List<Adoption> findByShelterId(Integer shelterId);

    @Query("SELECT a FROM Adoption a WHERE a.pet.idPet = ?1")
    List<Adoption> findByPetId(Integer petId);

    @Query("SELECT a FROM Adoption a WHERE a.status = ?1")
    List<Adoption> findByStatus(tn.esprit.petopia_backend.entities.adoptions.AdoptionStatus status);


}
