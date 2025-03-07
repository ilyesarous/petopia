package tn.esprit.petopia_backend.repositories.community;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.petopia_backend.entities.community.Comment;


public interface CommentRepository extends JpaRepository<Comment, Long> {
}
