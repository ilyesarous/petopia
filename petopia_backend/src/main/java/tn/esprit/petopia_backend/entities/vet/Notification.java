package tn.esprit.petopia_backend.entities.vet;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idNotification;
    private String message;
    private boolean seen;
    private Date notif_date;

    // relation notification * to 1 user
//    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
//    private Set<User> UserList;

    //classe user
//    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
//    private Set<Notification> NotificationList;
}
