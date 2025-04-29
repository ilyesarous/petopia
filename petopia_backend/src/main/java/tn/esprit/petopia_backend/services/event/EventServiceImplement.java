package tn.esprit.petopia_backend.services.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.event.Enum.EventStatus;
import tn.esprit.petopia_backend.entities.event.Enum.EventType;
import tn.esprit.petopia_backend.entities.event.Event;
import tn.esprit.petopia_backend.entities.event.Participation;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.event.EventRepository;
import tn.esprit.petopia_backend.services.user.UserService;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class EventServiceImplement implements IEventService {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private EventSmsService eventSmsService;
    @Autowired
    private ParticipationServiceImplement participationService;


    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event saveEventWithImage(Event event, String imageUrl) {
        event.setGeneratedImageUrl(imageUrl);
        return eventRepository.save(event);
    }

    @Override
    public Event createEvent(Event event,String imageUrl) {
        User user = userService.getUsersById(event.getOrganisateur().getId_user()).getOurUsers();
        event.setOrganisateur(user);
        //return eventRepository.save(event);

        /* String message = String.format("Rappel : L'événement '%s' est prévu. Ne manquez pas !",
                    event.getNameEvent());
            eventSmsService.sendSms(user.getPhoneNumber(),message);
*/
        if (imageUrl != null && !imageUrl.isEmpty()) {
            event.setGeneratedImageUrl(imageUrl);
        }
        // Envoyer SMS seulement si la date est demain
        LocalDate today = LocalDate.now();
        LocalDate eventDate = event.getDateEvent().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        if (eventDate.equals(today.plusDays(1))) {
            String message = String.format(
                    "Rappel : L'événement '%s' est prévu pour demain %s. Lieu : %s. Ne manquez pas !",
                    event.getNameEvent(),
                    event.getDateEvent().toString(),
                    event.getLieuEvent()
            );

            if (user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty()) {
                eventSmsService.sendSms(user.getPhoneNumber(), message);
            }
        }


        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(Long id, Event updatedEvent) {
        return eventRepository.findById(id).map(event -> {
            // Vérifier si le statut passe à ANNULE
            if (updatedEvent.getStatusEvent() == EventStatus.ANNULE &&
                    event.getStatusEvent() != EventStatus.ANNULE) {
                notifyParticipantsAboutCancellation(event,
                        "L'événement '"+event.getNameEvent()+"' a été annulé.");
            }
            event.setNameEvent(updatedEvent.getNameEvent());
            event.setDescriptionEvent(updatedEvent.getDescriptionEvent());
            event.setPlacesMaxEvent(updatedEvent.getPlacesMaxEvent());
            event.setEventType(updatedEvent.getEventType());
            event.setLattitudeEvent(updatedEvent.getLattitudeEvent());
            event.setLongitudeEvent(updatedEvent.getLongitudeEvent());
            event.setDateEvent(updatedEvent.getDateEvent());
            event.setLieuEvent(updatedEvent.getLieuEvent());
            event.setPrixEvent(updatedEvent.getPrixEvent());
            event.setStatusEvent(updatedEvent.getStatusEvent());
            event.setVisibiliteEvent(updatedEvent.getVisibiliteEvent());

            return eventRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    @Override
    public void deleteEvent(Long id) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        // Envoyer les SMS aux participants avant suppression
        notifyParticipantsAboutCancellation(event, "L'événement '"+event.getNameEvent()+"' a été supprimé.");
        eventRepository.deleteById(id);

    }

    @Override
    public List<Event> filterEvents(String name, String lieu, Date startDate, Date endDate, String eventType, String status, Double minPrice, Double maxPrice) {
        Specification<Event> spec = Specification.where(null);

        if (name != null && !name.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("nameEvent")), "%" + name.toLowerCase() + "%"));
        }
        if (lieu != null && !lieu.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("lieuEvent")), "%" + lieu.toLowerCase() + "%"));
        }
        if (startDate != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("dateEvent"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("dateEvent"), endDate));
        }
        if (eventType != null && !eventType.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("eventType"), EventType.valueOf(eventType)));
        }
        if (status != null && !status.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("statusEvent"), EventStatus.valueOf(status)));
        }
        if (minPrice != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("prixEvent"), minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("prixEvent"), maxPrice));
        }

        return eventRepository.findAll(spec);
    }
    private void notifyParticipantsAboutCancellation(Event event, String message) {
        List<Participation> participations = participationService.getParticipationsByEventId(event.getIdEvent());

        for (Participation participation : participations) {
            User participant = participation.getParticipant();
            if (participant.getPhoneNumber() != null && !participant.getPhoneNumber().isEmpty()) {
                String fullMessage = message + " Nous sommes désolés pour ce contretemps.";
                eventSmsService.sendSms(participant.getPhoneNumber(), fullMessage);
            }
        }
    }
    public List<Event> getEventsWithImages() {
        return eventRepository.findByGeneratedImageUrlIsNotNull();
    }
}



