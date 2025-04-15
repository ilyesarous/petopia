package tn.esprit.petopia_backend.services.event;

import tn.esprit.petopia_backend.entities.event.Event;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface IEventService {
    public List<Event> getAllEvents();
    public Optional<Event> getEventById(Long id);
    public Event createEvent(Event event);
    public Event updateEvent(Long id, Event updatedEvent);
    public void deleteEvent(Long id);
    List<Event> filterEvents(String name, String lieu, Date startDate, Date endDate, String eventType, String status, Double minPrice, Double maxPrice);
}
