package tn.esprit.petopia_backend.services.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.event.Enum.EventStatus;
import tn.esprit.petopia_backend.entities.event.Enum.ParticipationStatus;
import tn.esprit.petopia_backend.entities.event.Event;
import tn.esprit.petopia_backend.entities.event.Participation;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.event.ParticipationRepository;
import tn.esprit.petopia_backend.services.user.UserService;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ParticipationServiceImplement implements IParticipationService {

    @Autowired
    private ParticipationRepository participationRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private EventSmsService eventSmsService;



    @Override
    public List<Participation> getAllParticipations() {
        return participationRepository.findAll();
    }

    @Override
    public Optional<Participation> getParticipationById(Long id) {
        return participationRepository.findById(id);
    }

    @Override
    public Participation createParticipation(Participation participation) {
        /*User user = userService.getUsersById(participation.getParticipant().getId_user()).getOurUsers();
        participation.setParticipant(user);
        return participationRepository.save(participation);
        //Hata el houni fonctionnel
         */

        // Check if user already participates
        if (participationRepository.existsByParticipantAndEvent(
                participation.getParticipant().getId_user(),
                participation.getEvent().getIdEvent())) {
            throw new RuntimeException("User already participates in this event");
        }

        User user = userService.getUsersById(participation.getParticipant().getId_user()).getOurUsers();
        participation.setParticipant(user);
        return participationRepository.save(participation);
    }

    @Override
    public Participation updateParticipation(Long id, Participation updatedParticipation) {
        return participationRepository.findById(id).map(participation -> {


            // Vérifier si le statut passe à ANNULE
            if (updatedParticipation.getStatusParticipation() == ParticipationStatus.CONFIRMED) {
                notifyParticipantsAboutConfirmed(participation,
                        "Votre participation '"+participation.getIdParticipation()+"' a été confirmed veuillez passer au payment de votre participation.");
            }
            participation.setStatusParticipation(updatedParticipation.getStatusParticipation());
            participation.setDateInscription(updatedParticipation.getDateInscription());
            participation.setPaid(updatedParticipation.getPaid());
            return participationRepository.save(participation);
        }).orElseThrow(() -> new RuntimeException("Participation not found"));
    }


    private void notifyParticipantsAboutConfirmed(Participation participation, String message) {
        // Utilisez directement le repository au lieu du service
        List<Participation> participations = participationRepository.findByEventId(participation.getEvent().getIdEvent());

        for (Participation p : participations) {
            User participant = p.getParticipant();
            if (participant.getPhoneNumber() != null && !participant.getPhoneNumber().isEmpty()) {
                String fullMessage = message + " Nous sommes désolés pour ce contretemps.";
                eventSmsService.sendSms(participant.getPhoneNumber(), fullMessage);
            }
        }
    }


    @Override
    public void deleteParticipation(Long id) {
            participationRepository.deleteById(id);
    }

    @Override
    public List<Participation> getParticipationsByStatus(ParticipationStatus status) {
        return participationRepository.findByStatusParticipation(status);
    }

    @Override
    public Participation updateParticipationStatus(Long id, ParticipationStatus status) {

        return null;
    }


    @Override
    public List<Participation> getUserParticipations(Integer userId) {
        User user = userService.getUsersById(userId).getOurUsers();
        return participationRepository.findByParticipant(user);
    }

    // In ParticipationServiceImplement.java
    @Override
    public int countByEventId(Long eventId) {
        return participationRepository.countByEventIdEvent(eventId);
    }


    @Override
    public boolean checkUserParticipation(Integer userId, Long eventId) {
        try {
            return participationRepository.existsByParticipantAndEvent(userId, eventId);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la vérification de la participation", e);
        }
    }

    public List<Participation> getParticipationsByEventId(Long eventId) {
        return participationRepository.findByEventId(eventId);
    }


    public Long getTimeRemaining(Long participationId) {
        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new RuntimeException("Participation not found"));

        if (participation.getEvent() == null || participation.getEvent().getDateEvent() == null) {
            return null;
        }

        return participation.getEvent().getDateEvent().getTime() - new Date().getTime();
    }
}
