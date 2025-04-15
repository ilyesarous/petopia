package tn.esprit.petopia_backend.services.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.event.Event;
import tn.esprit.petopia_backend.entities.event.Participation;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.event.EventRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
public class EventReminderService {

        @Autowired
        private EventRepository eventRepository;
        @Autowired
        private ParticipationServiceImplement participationService;
        @Autowired
        private EventSmsService eventSmsService;


    @Scheduled(cron = "0 0 9 * * ?") // Every day at 9 AM
    public void sendEventReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);

        // Convert LocalDate to Date
        Date startDate = Date.from(tomorrow.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(tomorrow.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant());

        List<Event> events = eventRepository.findByDateEventBetween(startDate, endDate);

        for (Event event : events) {
            List<Participation> participations = participationService.getParticipationsByEventId(event.getIdEvent());

            for (Participation participation : participations) {
                User participant = participation.getParticipant();
                if (participant.getPhoneNumber() != null && !participant.getPhoneNumber().isEmpty()) {
                    String message = String.format(
                            "Rappel : L'événement '%s' est prévu pour demain %s. Lieu : %s.",
                            event.getNameEvent(),
                            event.getDateEvent().toString(), // Or format this date nicely
                            event.getLieuEvent()
                    );
                    eventSmsService.sendSms(participant.getPhoneNumber(), message);
                }
            }
        }
    }
}


