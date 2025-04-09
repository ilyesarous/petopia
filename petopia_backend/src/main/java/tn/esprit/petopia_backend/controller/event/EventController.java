package tn.esprit.petopia_backend.controller.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.event.Event;
import tn.esprit.petopia_backend.services.event.EventServiceImplement;
import tn.esprit.petopia_backend.services.event.IEventService;

import javax.sound.midi.Soundbank;
import java.util.List;

@RestController
//@RequestMapping("/admin/events")
@RequestMapping("/events")
@CrossOrigin(origins = "http://localhost:4200")
public class EventController {

    @Autowired
    private EventServiceImplement eventService;


    // http://localhost:8082/petopia/admin/events/getEtudiants
    // http://localhost:8082/petopia/events/getEtudiants

    @GetMapping("/getEtudiants")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_USER')")
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/display/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_USER')")

    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // http://localhost:8082/petopia/admin/events/addEvent
    @PostMapping("/addEvent")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")

    public Event createEvent(@RequestBody Event event) {
        System.out.println(event);
        return eventService.createEvent(event);

    }

    @PutMapping("/updateEvent/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_USER')")

    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        try {
            return ResponseEntity.ok(eventService.updateEvent(id, updatedEvent));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/deleteEvent/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")

    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

}
