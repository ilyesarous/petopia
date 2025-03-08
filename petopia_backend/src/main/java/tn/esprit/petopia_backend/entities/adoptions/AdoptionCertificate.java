package tn.esprit.petopia_backend.entities.adoptions;

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

    @OneToOne
    private User user;

    @OneToOne
    private Pet pet;

    @OneToOne
    private Shelter shelter;

    private LocalDateTime issued_date;

    @Column(columnDefinition = "TEXT")
    private String user_signature;

    @Column(columnDefinition = "TEXT")
    private String shelter_signature;
}

