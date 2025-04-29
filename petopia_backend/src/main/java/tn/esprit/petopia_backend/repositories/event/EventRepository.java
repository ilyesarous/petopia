package tn.esprit.petopia_backend.repositories.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.event.Event;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {
    // Add this method for finding events between two dates
    List<Event> findByDateEventBetween(Date startDate, Date endDate);

    // Optionally add this if you need events after a certain date
    List<Event> findByDateEventAfter(Date startDate);

    // Optionally add this if you need events before a certain date
    List<Event> findByDateEventBefore(Date endDate);
    // Add this if you need to find events with images
    List<Event> findByGeneratedImageUrlIsNotNull();
}


