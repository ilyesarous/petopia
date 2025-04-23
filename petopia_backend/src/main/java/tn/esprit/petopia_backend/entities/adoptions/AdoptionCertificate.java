package tn.esprit.petopia_backend.entities.adoptions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.user.User;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "AdoptionCertificate")
public class AdoptionCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_certificate;



    private LocalDateTime issued_date;

    @Column(columnDefinition = "TEXT")
    private String user_signature;

    @Column(columnDefinition = "TEXT")
    private String shelter_signature;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private User user;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Pet pet;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    @JsonIgnore
    private Shelter shelter;

    @OneToOne
    @JsonIgnore
    private Adoption adoption;

}

