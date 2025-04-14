package tn.esprit.petopia_backend.entities.vet;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.user.User;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Rating_Vet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idRating;

    private Integer note;
    private String Comment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userclient_id_user", nullable = false)
    private User userclientR;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uservet_id_user", nullable = false)
    private User uservetR;

    public int getIdRating() {
        return idRating;
    }

    public void setIdRating(int idRating) {
        this.idRating = idRating;
    }

    public Integer getNote() {
        return note;
    }

    public void setNote(Integer note) {
        this.note = note;
    }

    public String getComment() {
        return Comment;
    }

    public void setComment(String comment) {
        Comment = comment;
    }

    public User getUserclientR() {
        return userclientR;
    }

    public void setUserclientR(User userclientR) {
        this.userclientR = userclientR;
    }

    public User getUservetR() {
        return uservetR;
    }

    public void setUservetR(User uservetR) {
        this.uservetR = uservetR;
    }
}
