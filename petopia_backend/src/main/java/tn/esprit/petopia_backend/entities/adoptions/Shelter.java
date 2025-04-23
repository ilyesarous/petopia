package tn.esprit.petopia_backend.entities.adoptions;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.user.User;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Shelter")
public class Shelter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_shelter;

    private String shelter_name;
    private String location;
    private double latitude;
    private double longitude;

    private String email;
    private String phone_number;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String website;
    private String logoUrl;

    @OneToOne(mappedBy = "shelter", cascade = CascadeType.ALL)
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "shelter", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Pet> pets;

    @OneToMany(mappedBy = "shelter", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Adoption> adoptions;

    @OneToMany(mappedBy = "shelter", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<AdoptionCertificate> certificates;
}
