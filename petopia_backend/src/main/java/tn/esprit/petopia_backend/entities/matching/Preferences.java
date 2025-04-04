package tn.esprit.petopia_backend.entities.matching;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.pet.Pet;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Preferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_preference;
    private String preferred_breed ;
    private int min_age ;
    private int max_age ;
    private String preferred_gender;
    private String preferred_location;


    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private Pet pet;

}
