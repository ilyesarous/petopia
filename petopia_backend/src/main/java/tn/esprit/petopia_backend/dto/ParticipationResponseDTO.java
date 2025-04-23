package tn.esprit.petopia_backend.dto;

import lombok.Data;
import tn.esprit.petopia_backend.entities.event.Event;
import tn.esprit.petopia_backend.entities.event.Participation;
import tn.esprit.petopia_backend.entities.user.User;

import java.util.Date;

@Data
public class ParticipationResponseDTO {
    private Long idParticipation;
    private Date dateInscription;
    private Event event;
    private User participant;
    private String statusParticipation;
    private Long timeRemaining; // temps restant en millisecondes

    // Constructeur à partir d'une Participation
    public ParticipationResponseDTO(Participation participation) {
        this.idParticipation = participation.getIdParticipation();
        this.dateInscription = participation.getDateInscription();
        this.event = participation.getEvent();
        this.participant = participation.getParticipant();
        this.statusParticipation = participation.getStatusParticipation().name();
        this.timeRemaining = participation.getTimeRemaining();
    }
}