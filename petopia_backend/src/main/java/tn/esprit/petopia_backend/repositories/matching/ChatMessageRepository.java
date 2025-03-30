package tn.esprit.petopia_backend.repositories.matching;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.petopia_backend.entities.matching.ChatMessage;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository <ChatMessage, Long> {
    List<ChatMessage> findByMatchId(int matchId);
}
