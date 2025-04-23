package tn.esprit.petopia_backend.services.event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.dto.EventNotification;
import tn.esprit.petopia_backend.dto.SignupNotification;

@Service
public class EventNotificationService {
    @Autowired
    private final SimpMessagingTemplate messagingTemplate;

    public EventNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    public void notifyNewSignup(EventNotification notification) {
        System.out.println("test211111");
        messagingTemplate.convertAndSend("/topic/new-events", notification);
        System.out.println("testtttttttt22222222");
    }
}
