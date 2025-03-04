package tn.esprit.petopia_backend.entities.user;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name="Reclamation")
@Table
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idReclamation;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    private String type;
    private String description;
    private String statusReclamation;
    private Date dateReclamation;

}
