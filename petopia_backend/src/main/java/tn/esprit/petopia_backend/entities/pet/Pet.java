package tn.esprit.petopia_backend.entities.pet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import tn.esprit.petopia_backend.entities.adoptions.Shelter;
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

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = true)
    private User user;

    private String petName;
    private int petAge;
    private String petImage;
    private String breed;
    private String location=null;
    private float attitudeX ;
    private float attitudeY ;

    @Enumerated(EnumType.STRING)
    private Species species;

    @Enumerated(EnumType.STRING)
    private PetStatus status=null;
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private Size size;

    private String healthStatus =null;

    @ManyToOne
    @JsonIgnore
    private Shelter shelter;
}