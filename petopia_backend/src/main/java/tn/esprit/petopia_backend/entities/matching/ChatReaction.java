package tn.esprit.petopia_backend.entities.matching;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;
import tn.esprit.petopia_backend.entities.user.ChatMessage;

@Entity
@Table(name = "chat_reaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatReaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "message_id", nullable = false)
    @JsonBackReference
    private ChatMessage message;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "reaction", nullable = false)
    private String reaction; // e.g., "❤️", "👍", "😊"

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    @PrePersist
    public void prePersist() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }
}