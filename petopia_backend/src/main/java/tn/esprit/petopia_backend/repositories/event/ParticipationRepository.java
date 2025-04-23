package tn.esprit.petopia_backend.repositories.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.event.Enum.ParticipationStatus;
import tn.esprit.petopia_backend.entities.event.Participation;
import tn.esprit.petopia_backend.entities.user.User;

import java.util.List;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {
    // Recherche par statut
    List<Participation> findByStatusParticipation(ParticipationStatus status);

    // Recherche par participant (2 options possibles)

    // Option 1: Si vous voulez chercher par l'objet User entier
    List<Participation> findByParticipant(User participant);

    // Option 2: Si vous voulez chercher par l'ID du participant
    //@Query("SELECT p FROM Participation p WHERE p.participant.id_user = :userId")
    //List<Participation> findByParticipantId(@Param("userId") Integer userId);

    int countByEventIdEvent(Long eventId);
    @Query("SELECT p FROM Participation p WHERE p.event.idEvent = :eventId")
    List<Participation> findByEventId(@Param("eventId") Long eventId);

    @Query("SELECT COUNT(p) > 0 FROM Participation p WHERE p.participant.id_user = :userId AND p.event.idEvent = :eventId")
    boolean existsByParticipantAndEvent(@Param("userId") Integer userId, @Param("eventId") Long eventId);



}
