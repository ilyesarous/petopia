package tn.esprit.petopia_backend.entities.vet;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Pet_Growth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPet_Growth;
    private Date measurement_date;
    private Double weight;
    private Double height;
    @Enumerated(EnumType.STRING)
    private health_type health_status;
}
