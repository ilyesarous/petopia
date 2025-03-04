package tn.esprit.petopia_backend.entities.vet;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.Pet;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Diagnosis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idDiagnosis;
    private String diagnosis_description;
    private LocalDate diagnosis_date;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "diagnosis")
    private Set<Medicament_Prescription> Medicament_PrescriptionList;

    //relation * diagnosis andd 1 pet
    @ManyToOne(cascade = CascadeType.ALL)
    private Pet petdiagnosis;

    public int getIdDiagnosis() {
        return idDiagnosis;
    }

    public void setIdDiagnosis(int idDiagnosis) {
        this.idDiagnosis = idDiagnosis;
    }

    public String getDiagnosis_description() {
        return diagnosis_description;
    }

    public void setDiagnosis_description(String diagnosis_description) {
        this.diagnosis_description = diagnosis_description;
    }

    public LocalDate getDiagnosis_date() {
        return diagnosis_date;
    }

    public void setDiagnosis_date(LocalDate diagnosis_date) {
        this.diagnosis_date = diagnosis_date;
    }

    public Set<Medicament_Prescription> getMedicament_PrescriptionList() {
        return Medicament_PrescriptionList;
    }

    public void setMedicament_PrescriptionList(Set<Medicament_Prescription> medicament_PrescriptionList) {
        Medicament_PrescriptionList = medicament_PrescriptionList;
    }

    public Pet getPetdiagnosis() {
        return petdiagnosis;
    }

    public void setPetdiagnosis(Pet petdiagnosis) {
        this.petdiagnosis = petdiagnosis;
    }
}
