package tn.esprit.petopia_backend.services.notif;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.dto.SignupNotification;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyNewSignup(SignupNotification notification) {
        messagingTemplate.convertAndSend("/topic/new-signups", notification);
    }
}
