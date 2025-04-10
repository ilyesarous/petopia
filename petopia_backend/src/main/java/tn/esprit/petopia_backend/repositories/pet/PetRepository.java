package tn.esprit.petopia_backend.repositories.pet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface PetRepository extends JpaRepository<Pet,Integer>
{
    @Query("SELECT p FROM Pet p WHERE p.shelter.id_shelter = ?1")
    List<Pet> findByShelterId(Integer shelterId);

    @Query("SELECT p FROM Pet p WHERE p.user.id_user = ?1")
    List<Pet> findByOwnerId(Integer ownerId);

    @Query("SELECT p FROM Pet p WHERE p.status = ?1")
    List<Pet> findByStatus(tn.esprit.petopia_backend.entities.pet.PetStatus status);


        @Query("SELECT p FROM Pet p WHERE p.idPet = :idPet")
        Optional<Pet> findSimplePetById(@Param("idPet") int idPet);

    @Query("""
  SELECT p FROM Pet p 
  WHERE p.status = 'AVAILABLE' 
    AND p.user IS NULL 
    AND p.idPet NOT IN (
      SELECT a.pet.idPet 
      FROM Adoption a 
      WHERE a.requester.id_user = :userId
    )
""")
    List<Pet> findAllUnassignedPets(@Param("userId") Integer userId);


}