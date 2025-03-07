package tn.esprit.petopia_backend.repositories.adoptions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.adoptions.Shelter;

@Repository
public interface ShelterRepository extends JpaRepository<Shelter, Integer> {
    @Query("SELECT s FROM Shelter s WHERE s.user.id_user = ?1")
    Shelter findByUserId(Integer userId);
}

