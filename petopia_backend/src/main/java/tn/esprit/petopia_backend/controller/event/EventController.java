package tn.esprit.petopia_backend.controller.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.event.Event;
import tn.esprit.petopia_backend.services.event.EventServiceImplement;
import tn.esprit.petopia_backend.services.event.IEventService;

import java.util.List;

@RestController
@RequestMapping("/admin/events")
public class EventController {

    @Autowired
    private EventServiceImplement eventService;


    // http://localhost:8082/petopia/admin/events/getEtudiants
    @GetMapping("/getEtudiants")
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/display/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // http://localhost:8082/petopia/admin/events/addEvent
    @PostMapping("/addEvent")
    public Event createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }

    @PutMapping("/updateEvent/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        try {
            return ResponseEntity.ok(eventService.updateEvent(id, updatedEvent));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/deleteEvent/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

}
