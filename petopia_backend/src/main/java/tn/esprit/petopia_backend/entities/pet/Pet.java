package tn.esprit.petopia_backend.entities.pet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import tn.esprit.petopia_backend.entities.matching.Preferences;
import tn.esprit.petopia_backend.entities.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="Pet")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPet;
    private String petName;
    private int petAge;
    private String petImage;
    private String breed;
    private String location=null;
    private float attitudeX ;
    private float attitudeY ;
    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false)
    private User user;

    @OneToOne
    @JsonIgnore
    private Preferences preferences;
}