package tn.esprit.petopia_backend.entities.event;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.event.Enum.ParticipationStatus;
import tn.esprit.petopia_backend.entities.user.User;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idParticipation;

    private Date dateInscription;
    private Boolean paid;

    @ManyToOne
    private Event event;

    @ManyToOne
    private User participant;

    @Enumerated(EnumType.STRING)
    private ParticipationStatus statusParticipation;

    @Transient
    private Long timeRemaining; // temps restant en millisecondes





    @Override
    public String toString() {
        return "Participation{" +
                "idParticipation=" + idParticipation +
                ", dateInscription=" + dateInscription +
                ", event=" + event +
                ", participant=" + participant +
                ", statusParticipation=" + statusParticipation +
                '}';
    }
}
