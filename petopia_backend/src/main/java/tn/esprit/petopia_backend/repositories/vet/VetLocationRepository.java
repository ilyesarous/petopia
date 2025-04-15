package tn.esprit.petopia_backend.repositories.vet;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.petopia_backend.entities.vet.VetLocation;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VetLocationRepository extends JpaRepository<VetLocation, Long> {
    @Query("SELECT vl FROM VetLocation vl WHERE vl.vet.id_user = :vetId")
    List<VetLocation> findByVetId(@Param("vetId") Integer vetId);

    List<VetLocation> findAll();
}
