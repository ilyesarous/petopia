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
public class Matches {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_match;

    @ManyToOne
    private Pet pet_1 ;

    @ManyToOne
    private Pet pet_2;

    private boolean compatibilite;

    @Enumerated(EnumType.STRING)
    private MatchStatus status;
}
