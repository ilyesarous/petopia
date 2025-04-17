package tn.esprit.petopia_backend.repositories.matching;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.petopia_backend.entities.user.ChatMessage;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("SELECT m FROM ChatMessage m LEFT JOIN FETCH m.reactions WHERE m.matchId = :matchId")
    List<ChatMessage> findByMatchId(@Param("matchId") int matchId);
}