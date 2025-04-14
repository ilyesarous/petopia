package tn.esprit.petopia_backend.repositories.vet;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import tn.esprit.petopia_backend.entities.vet.Rating_Vet;

import java.util.List;

public interface RatingVetRepository extends CrudRepository<Rating_Vet, Integer> {

    @Query("SELECT r FROM Rating_Vet r WHERE r.uservetR.id_user = :userId")
    List<Rating_Vet> findByUserId(@Param("userId") Integer userId);
}
