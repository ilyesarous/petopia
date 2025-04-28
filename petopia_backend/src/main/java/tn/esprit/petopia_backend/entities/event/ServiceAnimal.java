package tn.esprit.petopia_backend.entities.event;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import tn.esprit.petopia_backend.entities.event.Enum.ServiceType;
import tn.esprit.petopia_backend.entities.user.User;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ServiceAnimal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idServiceAnimal;

    private float prixServiceAnimal;
    private String descriptionServiceAnimal;
    private boolean disponibilite = true;

    @Enumerated(EnumType.STRING)
    private ServiceType typeService;


    // New fields
    private String location; // Where the service is needed
    private String animalType; // Type of animal (dog, cat, etc.)
    private String specialRequirements; // Any special needs
    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    private String imagePath; // Path to uploaded image

    @OneToMany(mappedBy = "serviceAnimal", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ReservationService> reservations;

    @ManyToOne
    @JsonIgnore
    private User organisateurServiceAnimal;



}
