package tn.esprit.petopia_backend.repositories.community;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.community.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
}
