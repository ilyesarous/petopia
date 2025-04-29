package tn.esprit.petopia_backend.repositories.matching;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.matching.MatchStatus;
import tn.esprit.petopia_backend.entities.matching.Matches;
import java.util.List;

@Repository
public interface MatchesRepository extends JpaRepository  <Matches,Integer> {
    @Query("SELECT m FROM Matches m WHERE m.pet_2.idPet = ?1 AND m.status = ?2")
    List<Matches> findByPet2IdAndStatus(int pet2Id, MatchStatus status);
//    @Query("SELECT m FROM Matches m WHERE m.status = ?1")
//    List<Matches> findByStatus(MatchStatus status);

    // Method to find matches by status
    List<Matches> findByStatus(MatchStatus status);

    // New method for blocking filter
    @Query("SELECT m FROM Matches m WHERE m.pet_2.idPet = :pet2Id AND m.status = :status " +
            "AND (m.pet_1.user IS NULL OR m.pet_1.user.id_user NOT IN :blockedUserIds) " +
            "AND (m.pet_2.user IS NULL OR m.pet_2.user.id_user NOT IN :blockedUserIds)")
    List<Matches> findByPet2IdAndStatusWithBlockFilter(@Param("pet2Id") int pet2Id, @Param("status") MatchStatus status, @Param("blockedUserIds") List<Integer> blockedUserIds);

    @Query("SELECT m FROM Matches m WHERE m.status = :status " +
            "AND (m.pet_1.user IS NULL OR m.pet_1.user.id_user NOT IN :blockedUserIds) " +
            "AND (m.pet_2.user IS NULL OR m.pet_2.user.id_user NOT IN :blockedUserIds)")
    List<Matches> findByStatusWithBlockFilter(@Param("status") MatchStatus status, @Param("blockedUserIds") List<Integer> blockedUserIds);

}
