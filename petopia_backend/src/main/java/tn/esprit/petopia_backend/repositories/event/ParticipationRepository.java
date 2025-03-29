package tn.esprit.petopia_backend.repositories.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.event.Participation;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {
}
