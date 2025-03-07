package tn.esprit.petopia_backend.entities.matching;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.esprit.petopia_backend.entities.user.User;

import java.util.Date;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idChat;

//    @ManyToMany(mappedBy = "chats")
//    private Set<User> users;
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private User users;
    private Date date;
    private String discussion;
}
