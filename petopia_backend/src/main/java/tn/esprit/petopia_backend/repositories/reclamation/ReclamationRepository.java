package tn.esprit.petopia_backend.repositories.reclamation;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.reclamation.Reclamation;

import java.util.List;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Integer> {
    @Query("SELECT r FROM Reclamation r WHERE r.user.id_user = :userId")
    List<Reclamation> findByUserId(@Param("userId") Integer userId);
    @Modifying
    @Transactional
    @Query("UPDATE Reclamation r SET r.description = :description WHERE r.idReclamation = :reclamationId AND r.user.id_user = :userId")
    int updateDescriptionByReclamationIdAndUserId(
            @Param("reclamationId") Integer reclamationId,
            @Param("userId") Integer userId,
            @Param("description") String description
    );

}

