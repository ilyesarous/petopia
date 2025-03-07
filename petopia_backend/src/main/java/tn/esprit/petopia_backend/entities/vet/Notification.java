package tn.esprit.petopia_backend.entities.vet;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.user.User;

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
    private boolean seen = false;

    @Temporal(TemporalType.TIMESTAMP)
    private Date notif_date;

    @PrePersist
    protected void onCreate() {
        notif_date = new Date(); // Initialise la date avec la date et l'heure actuelles lors de la création
    }

    @PreUpdate
    protected void onUpdate() {
        notif_date = new Date(); // Met à jour la date avec la date et l'heure actuelles lors de la mise à jour
    }

    //relation notif * to 1 user
//    @ManyToOne(cascade = CascadeType.ALL)
//    private User notif;
    //@ManyToOne(fetch = FetchType.LAZY)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "notification_id_user", nullable = false) // Clé étrangère dans la table notification
    private User user;

    public int getIdNotification() {
        return idNotification;
    }

    public void setIdNotification(int idNotification) {
        this.idNotification = idNotification;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSeen() {
        return seen;
    }

    public void setSeen(boolean seen) {
        this.seen = seen;
    }

    public Date getNotif_date() {
        return notif_date;
    }

    public void setNotif_date(Date notif_date) {
        this.notif_date = notif_date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
