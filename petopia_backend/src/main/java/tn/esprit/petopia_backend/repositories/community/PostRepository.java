package tn.esprit.petopia_backend.repositories.community;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.community.Post;
import tn.esprit.petopia_backend.entities.community.PostType;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByPostType(PostType postType);

}
