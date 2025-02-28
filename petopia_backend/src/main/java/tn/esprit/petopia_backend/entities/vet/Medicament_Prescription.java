package tn.esprit.petopia_backend.entities.vet;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Medicament_Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idMedicament_Prescription;
    private String medicament;

    @ManyToOne(cascade = CascadeType.ALL)
    private Diagnosis diagnosis;
}
