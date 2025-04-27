package tn.esprit.petopia_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationMessage {
    private String id;
    private String type; // e.g., "MATCH_ACCEPTED"
    private String message; // e.g., "Your pet Max has been matched with Bella!"
    private int matchId;
    private int senderId; // User who accepted the match
    private int receiverId; // User receiving the notification
    private String timestamp;
}
