package tn.esprit.petopia_backend.entities.vet;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
}
