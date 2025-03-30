package tn.esprit.petopia_backend.entities.vet;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.pet.Pet;

import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Pet_Growth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPet_Growth;
    private Double weight;
    private Double height;
    @Enumerated(EnumType.STRING)
    private health_type health_status;

    @Temporal(TemporalType.TIMESTAMP)
    private Date measurement_date;
    @PrePersist
    protected void onCreate() {
        measurement_date = new Date(); // Initialise la date avec la date et l'heure actuelles lors de la création
    }

    @PreUpdate
    protected void onUpdate() {
        measurement_date = new Date(); // Met à jour la date avec la date et l'heure actuelles lors de la mise à jour
    }

    //relation * pet growth andd 1 pet
//    @ManyToOne(cascade = CascadeType.ALL)
//    private Pet petgrowth;
    //@ManyToOne(fetch = FetchType.LAZY)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "petgrowth_id_pet")
    private Pet petgrowth;

    public int getIdPet_Growth() {
        return idPet_Growth;
    }

    public void setIdPet_Growth(int idPet_Growth) {
        this.idPet_Growth = idPet_Growth;
    }

    public Date getMeasurement_date() {
        return measurement_date;
    }

    public void setMeasurement_date(Date measurement_date) {
        this.measurement_date = measurement_date;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public health_type getHealth_status() {
        return health_status;
    }

    public void setHealth_status(health_type health_status) {
        this.health_status = health_status;
    }

    public Pet getPetgrowth() {
        return petgrowth;
    }

    public void setPetgrowth(Pet petgrowth) {
        this.petgrowth = petgrowth;
    }
}
