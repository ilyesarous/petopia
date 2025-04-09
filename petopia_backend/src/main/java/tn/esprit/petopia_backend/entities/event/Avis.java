package tn.esprit.petopia_backend.entities.event;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.user.User;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Avis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating; // 1 à 5 étoiles
    private String comment;

    @ManyToOne
    private User author;

    @ManyToOne
    private Event event;

    @ManyToOne
    private ServiceAnimal serviceAnimal;

    private LocalDateTime date;
}
