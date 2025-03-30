package tn.esprit.petopia_backend.entities.matching;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@Builder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int matchId;
    private int senderId; // ID de l'utilisateur qui envoie
    private int receiverId; // ID de l'utilisateur qui reçoit
    private String content; // Contenu du message
    private LocalDateTime timestamp; // Date et heure d'envoi

    @PrePersist
    public void prePersist() {
        this.timestamp = LocalDateTime.now();
    }

}

