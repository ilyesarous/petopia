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

    //relation * Medicament_Prescription fi wesett 1 diagnosis
    @ManyToOne(cascade = CascadeType.ALL)
    private Diagnosis diagnosis;

    public int getIdMedicament_Prescription() {
        return idMedicament_Prescription;
    }

    public void setIdMedicament_Prescription(int idMedicament_Prescription) {
        this.idMedicament_Prescription = idMedicament_Prescription;
    }

    public String getMedicament() {
        return medicament;
    }

    public void setMedicament(String medicament) {
        this.medicament = medicament;
    }

    public Diagnosis getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(Diagnosis diagnosis) {
        this.diagnosis = diagnosis;
    }
}
