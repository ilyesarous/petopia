package tn.esprit.petopia_backend.repositories.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.event.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
}
