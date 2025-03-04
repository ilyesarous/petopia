package tn.esprit.petopia_backend.entities.vet;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
}
