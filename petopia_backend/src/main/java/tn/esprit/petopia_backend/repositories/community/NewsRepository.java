package tn.esprit.petopia_backend.repositories.community;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.petopia_backend.entities.community.News;

public interface NewsRepository extends JpaRepository<News, Long> {
    boolean existsByUrl(String url);

}
