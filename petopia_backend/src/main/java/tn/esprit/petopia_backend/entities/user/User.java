package tn.esprit.petopia_backend.entities.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import tn.esprit.petopia_backend.entities.event.Coupon;
import tn.esprit.petopia_backend.entities.event.Event;

import tn.esprit.petopia_backend.entities.adoptions.Shelter;
import tn.esprit.petopia_backend.entities.community.Comment;
import tn.esprit.petopia_backend.entities.community.Post;
import tn.esprit.petopia_backend.entities.community.Reaction;
import tn.esprit.petopia_backend.entities.community.Story;
import tn.esprit.petopia_backend.entities.payment.PaymentRequest;
import tn.esprit.petopia_backend.entities.event.Participation;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.vet.Consultations;
import tn.esprit.petopia_backend.entities.vet.Notification;
import tn.esprit.petopia_backend.entities.reclamation.Reclamation;
import tn.esprit.petopia_backend.entities.store.Cart;
import tn.esprit.petopia_backend.entities.store.Feedback;
import tn.esprit.petopia_backend.entities.store.Product;
import tn.esprit.petopia_backend.entities.vet.Rating_Vet;


import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "User")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_user;
    private String name;
    private String phoneNumber;
    private String email;
    private String password;
    private Boolean locked = false;
    private Integer nb_points = 0;
    private int level = 1;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Coupon> coupons = new ArrayList<>();


    @Enumerated(EnumType.STRING)
    private UserRole role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Pet> listPets;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reclamation> listReclamation;


    //Vet
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "userclient")
    @JsonIgnore
    private Set<Consultations> consultationList;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "uservet")
    @JsonIgnore
    private Set<Consultations> consultationsvetList;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "userclientR")
    @JsonIgnore
    private Set<Rating_Vet> RatingUserToVetList;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "uservetR")
    @JsonIgnore
    private Set<Rating_Vet> RatingVetList;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    @JsonIgnore
    private Set<Notification> notificationsList;

    public Integer getId_user() {
        return id_user;
    }

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Cart cart;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Product> products;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Feedback> feedbacks;

    //SHELTER
    @OneToOne
    @JsonIgnore
    private Shelter shelter;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<PaymentRequest> paymentRequests;


    @OneToMany(mappedBy = "organisateur")
    @JsonIgnore
    private List<Event> eventList;

    // Une liste des participations de cet utilisateur
    @OneToMany(mappedBy = "participant", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Participation> participations;


    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !locked;  // Returns false if the account is locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    @Override
    public String getPassword() {
        return password;
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Post> posts;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Comment> comments;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Reaction> reactions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Story> stories;

    @Override
    public String toString() {
        return "User{" +
                "id_user=" + id_user +
                ", name='" + name + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                '}';
    }
}
