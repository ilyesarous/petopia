package tn.esprit.petopia_backend.services.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.event.Event;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.event.EventRepository;
import tn.esprit.petopia_backend.services.user.UserService;

import java.util.List;
import java.util.Optional;

@Service
public class EventServiceImplement implements IEventService {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserService userService;

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    @Override
    public Event createEvent(Event event) {
        User user = userService.getUsersById(event.getOrganisateur().getId_user()).getOurUsers();
        event.setOrganisateur(user);
        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(Long id, Event updatedEvent) {
        return eventRepository.findById(id).map(event -> {
            event.setNameEvent(updatedEvent.getNameEvent());
            event.setDescriptionEvent(updatedEvent.getDescriptionEvent());
            return eventRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    @Override
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);

    }
}
