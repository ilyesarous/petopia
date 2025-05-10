package tn.esprit.petopia_backend.controller.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.dto.EventNotification;
import tn.esprit.petopia_backend.entities.event.Event;
import tn.esprit.petopia_backend.services.event.EventNotificationService;
import tn.esprit.petopia_backend.services.event.EventServiceImplement;
import tn.esprit.petopia_backend.services.event.EventSmsService;
import tn.esprit.petopia_backend.services.event.IEventService;

import javax.sound.midi.Soundbank;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
//@RequestMapping("/admin/events")
@RequestMapping("/events")
@CrossOrigin(origins = "http://angular-service:4200")
public class EventController {

    @Autowired
    private EventServiceImplement eventService;
    @Autowired
    private EventServiceImplement eventServiceImplement;
    @Autowired
    EventNotificationService eventNotificationService;
    @Autowired
    EventSmsService eventSmsService;



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
        event.setAvailablePlaces(event.getPlacesMaxEvent());
        System.out.println(event);

            System.out.println(event.getNameEvent());
            System.out.println(event.getDateEvent());
            EventNotification eventNotification = new EventNotification(event.getNameEvent(), event.getDateEvent());
            eventNotificationService.notifyNewSignup(eventNotification);
            System.out.println("Done");

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
    @PutMapping("/decrementPlaces/{idEvent}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMIN')")

    public ResponseEntity<Event> decrementPlaces(@PathVariable Long idEvent) {
        Optional<Event> optionalEvent = eventService.getEventById(idEvent);

        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
            if (event.getAvailablePlaces() > 0) {
                event.setAvailablePlaces(event.getAvailablePlaces() - 1);

                Event updatedEvent = eventService.updateEvent(idEvent, event);
                return ResponseEntity.ok(updatedEvent);
            } else {
                throw new RuntimeException("No more places available");
            }

        } else {
            throw new RuntimeException("Event not found");
        }
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_USER')")
    public List<Event> filterEvents(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String lieu,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate,
            @RequestParam(required = false) String eventType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {

        return eventService.filterEvents(name, lieu, startDate, endDate, eventType, status, minPrice, maxPrice);
    }



}
