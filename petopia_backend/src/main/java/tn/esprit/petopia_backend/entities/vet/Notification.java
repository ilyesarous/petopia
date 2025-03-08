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
    private boolean seen;
    private Date notif_date;

//    //relation notif * to 1 user
//    @ManyToOne(cascade = CascadeType.ALL)
//    private User notif;

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

//    public User getNotif() {
//        return notif;
//    }
//
//    public void setNotif(User notif) {
//        this.notif = notif;
//    }
}
