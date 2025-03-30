package tn.esprit.petopia_backend.services.matching;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.matching.ChatMessage;
import tn.esprit.petopia_backend.repositories.matching.ChatMessageRepository;

import java.util.List;

@Service
public class MessagingService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageRepository messageRepository;

    public void sendMessage(ChatMessage message) {
        // Sauvegarder le message dans la base (optionnel)
        messageRepository.save(message);

        // Envoyer le message au topic spécifique au match
        String destination = "/topic/match/" + message.getMatchId();
        messagingTemplate.convertAndSend(destination, message);
    }

    public List<ChatMessage> getMessagesForMatch(int matchId) {
        return messageRepository.findByMatchId(matchId);
    }
}
