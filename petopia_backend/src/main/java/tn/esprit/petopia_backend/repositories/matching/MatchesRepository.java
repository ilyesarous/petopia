package tn.esprit.petopia_backend.repositories.matching;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.matching.MatchStatus;
import tn.esprit.petopia_backend.entities.matching.Matches;

import java.util.List;

@Repository
public interface MatchesRepository extends JpaRepository  <Matches,Integer> {
    @Query("SELECT m FROM Matches m WHERE m.pet_2.idPet = ?1 AND m.status = ?2")
    List<Matches> findByPet2IdAndStatus(int pet2Id, MatchStatus status);
}
