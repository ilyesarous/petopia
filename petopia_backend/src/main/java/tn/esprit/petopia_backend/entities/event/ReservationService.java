package tn.esprit.petopia_backend.entities.event;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.user.User;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idReservation;

    private Date dateReservation;



    @ManyToOne
    private ServiceAnimal serviceAnimal;

    @ManyToOne
    private User utilisateur;
}

