package tn.esprit.petopia_backend.entities.pet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import tn.esprit.petopia_backend.entities.adoptions.Shelter;
import tn.esprit.petopia_backend.entities.matching.Preferences;
import tn.esprit.petopia_backend.entities.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.vet.Consultations;
import tn.esprit.petopia_backend.entities.vet.Diagnosis;
import tn.esprit.petopia_backend.entities.vet.Pet_Growth;

import java.util.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Pet")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idPet;
    private String petName;
    private int petAge;
    private int petRefVet;
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] petImageBytes;
    private String breed;
    private String location;
    private float attitudeX;
    private float attitudeY;
    private String petImage;




    //lezmhaa tkoun null khater shelter ynajmch yaddi pet khaliwha true!!
    @ManyToOne
    @JoinColumn(name = "id_user", nullable = true)
    private User user;

    //1 pet inajem yekou barchaa diagnosis
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "petdiagnosis")
    @JsonIgnore
    private Set<Diagnosis> diagnosisList;

    //1 pet inajem yekou barchaa pet growth
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "petgrowth")
    @JsonIgnore
    private Set<Pet_Growth> petGrowthsList;

    //1 pet andou * consultation
    @OneToMany(mappedBy = "petconsultation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Consultations> petconsultationList;

    public int getIdPet() {
        return idPet;
    }

    @Enumerated(EnumType.STRING)
    private Species species;

    @Enumerated(EnumType.STRING)
    private PetStatus status=PetStatus.AVAILABLE;
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private Size size;

    @ElementCollection(targetClass = HealthCondition.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "pet_health_conditions", joinColumns = @JoinColumn(name = "pet_id"))
    @Column(name = "health_condition")
    private List<HealthCondition> healthStatus = new ArrayList<>();


    @ManyToOne
    private Shelter shelter;



//    @OneToOne
//    @JsonIgnore
//    private Preferences preferences;
    @OneToOne(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Preferences preferences;

}