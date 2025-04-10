package tn.esprit.petopia_backend.repositories.adoptions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionCertificate;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdoptionCertificateRepository extends JpaRepository<AdoptionCertificate, Integer> {
    @Query("SELECT COUNT(ac) > 0 FROM AdoptionCertificate ac WHERE ac.adoption.id_request = :adoptionId")
    boolean existsByAdoptionId(@Param("adoptionId") Integer adoptionId);

    @Query("SELECT ac FROM AdoptionCertificate ac WHERE ac.user.id_user = ?1")
    List<AdoptionCertificate> findByUserId(Integer userId);

    @Query("SELECT ac FROM AdoptionCertificate ac WHERE ac.pet.idPet = ?1")
    List<AdoptionCertificate> findByPetId(Integer petId);

    @Query("SELECT ac FROM AdoptionCertificate ac WHERE ac.shelter.id_shelter = ?1")
    List<AdoptionCertificate> findByShelterId(Integer shelterId);


    @Query("SELECT c FROM AdoptionCertificate c WHERE c.adoption.id_request = :adoptionId")
    Optional<AdoptionCertificate> findByAdoptionId(@Param("adoptionId") Integer adoptionId);}
