package tn.esprit.petopia_backend.entities.event;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.event.Enum.ServiceType;
import tn.esprit.petopia_backend.entities.user.User;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ServiceAnimal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idServiceAnimal;

    private float prixServiceAnimal;
    private String descriptionServiceAnimal;
    private boolean disponibilite;

    @Enumerated(EnumType.STRING)
    private ServiceType typeService;

    @OneToMany(mappedBy = "serviceAnimal", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ReservationService> reservations;
    @ManyToOne
    private User organisateurServiceAnimal;
}
