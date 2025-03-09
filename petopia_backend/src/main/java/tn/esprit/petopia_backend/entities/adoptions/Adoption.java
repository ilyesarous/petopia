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
@Table(name = "Adoption")
public class Adoption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_request;

    @ManyToOne
    private Pet pet;

    @ManyToOne
    private User requester;

    @ManyToOne
    @JsonIgnore
    private Shelter shelter;

    private LocalDateTime request_date;

    @Enumerated(EnumType.STRING)
    private AdoptionStatus status;

    @Column(columnDefinition = "TEXT")
    private String motivation_letter;

    private String cinimage;

    @OneToOne(mappedBy = "adoption", cascade = CascadeType.ALL)
    @JsonIgnore
    private AdoptionCertificate adoptionCertificate;

}
