package tn.esprit.petopia_backend.repositories.community;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.petopia_backend.entities.community.Story;

import java.time.LocalDateTime;
import java.util.List;

public interface StoryRepository extends JpaRepository<Story, Long> {
    List<Story> findByCreatedAtBefore(LocalDateTime expirationTime);
}