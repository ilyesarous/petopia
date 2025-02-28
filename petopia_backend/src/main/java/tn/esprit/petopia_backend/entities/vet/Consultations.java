package tn.esprit.petopia_backend.entities.vet;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Consultations {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idConsultation;

    private LocalDate consultation_date;
    private LocalTime start_time;
    private LocalTime end_time;
    @Enumerated(EnumType.STRING)
    private consultation_type consultationT;
    private Double consultation_price;
    @Enumerated(EnumType.STRING)
    private status_type statusT;


}
