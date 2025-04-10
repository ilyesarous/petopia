package tn.esprit.petopia_backend.services.matching;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.user.ChatMessage;
import tn.esprit.petopia_backend.repositories.matching.ChatMessageRepository;

import java.util.List;

@Service
public class MessagingService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageRepository messageRepository;

    public void sendMessage(ChatMessage message) {
        // Save the message
        messageRepository.save(message);

        // Send to user-specific queues
        messagingTemplate.convertAndSendToUser(
                String.valueOf(message.getSenderId()),
                "/queue/private-" + message.getMatchId(),
                message
        );
        messagingTemplate.convertAndSendToUser(
                String.valueOf(message.getReceiverId()),
                "/queue/private-" + message.getMatchId(),
                message
        );
    }

    public List<ChatMessage> getMessagesForMatch(int matchId) {
        return messageRepository.findByMatchId(matchId);
    }
}