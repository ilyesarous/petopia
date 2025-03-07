package tn.esprit.petopia_backend.repositories.adoptions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionCertificate;

import java.util.List;

@Repository
public interface AdoptionCertificateRepository extends JpaRepository<AdoptionCertificate, Integer> {
    @Query("SELECT ac FROM AdoptionCertificate ac WHERE ac.user.id_user = ?1")
    List<AdoptionCertificate> findByUserId(Integer userId);

    @Query("SELECT ac FROM AdoptionCertificate ac WHERE ac.pet.idPet = ?1")
    List<AdoptionCertificate> findByPetId(Integer petId);

    @Query("SELECT ac FROM AdoptionCertificate ac WHERE ac.shelter.id_shelter = ?1")
    List<AdoptionCertificate> findByShelterId(Integer shelterId);
}
