package tn.esprit.petopia_backend.entities.event;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.event.Enum.EventStatus;
import tn.esprit.petopia_backend.entities.event.Enum.EventType;
import tn.esprit.petopia_backend.entities.event.Enum.VisibilityEvent;
import tn.esprit.petopia_backend.entities.user.User;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idEvent;

    private String nameEvent;
    private String descriptionEvent;
    private Date dateEvent;
    private String lieuEvent;
    private Float lattitudeEvent;
    private Float longitudeEvent;
    private double prixEvent;
    private int placesMaxEvent;
    private Integer availablePlaces;
    private Integer countdownDuration; // en minutes (optionnel)


    @Enumerated(EnumType.STRING)
    private EventType eventType;

    @ManyToOne
    private User organisateur;

    // Une liste de participations pour cet événement
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Participation> participations;

    @Enumerated(EnumType.STRING)
    private VisibilityEvent visibiliteEvent;

    @Enumerated(EnumType.STRING)
    private EventStatus statusEvent;

    @Override
    public String toString() {
        return "Event{" +
                "idEvent=" + idEvent +
                ", nameEvent='" + nameEvent + '\'' +
                ", descriptionEvent='" + descriptionEvent + '\'' +
                ", dateEvent=" + dateEvent +
                ", lieuEvent='" + lieuEvent + '\'' +
                ", lattitudeEvent=" + lattitudeEvent +
                ", longitudeEvent=" + longitudeEvent +
                ", prixEvent=" + prixEvent +
                ", placesMaxEvent=" + placesMaxEvent +
                ", eventType=" + eventType +
                ", organisateur=" + organisateur +
                ", visibiliteEvent=" + visibiliteEvent +
                ", statusEvent=" + statusEvent +
                '}';
    }
}
