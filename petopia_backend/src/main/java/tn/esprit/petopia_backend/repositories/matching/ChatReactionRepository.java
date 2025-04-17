package tn.esprit.petopia_backend.repositories.matching;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.petopia_backend.entities.matching.ChatReaction;

public interface ChatReactionRepository extends JpaRepository<ChatReaction, Long> {
}