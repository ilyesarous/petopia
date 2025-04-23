package tn.esprit.petopia_backend.controller.matching;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import tn.esprit.petopia_backend.entities.user.ChatMessage;
import tn.esprit.petopia_backend.entities.user.MessageType;
import tn.esprit.petopia_backend.services.matching.MessagingService;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.user.UserRepository;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessagingService messagingService;
    private final UserRepository userRepository;

    @MessageMapping("/match/{matchId}")
    public void handleChatMessage(
            @Payload ChatMessage chatMessage,
            @DestinationVariable int matchId
    ) {
        chatMessage.setMatchId(matchId);
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessage.setType(MessageType.CHAT);

        if (chatMessage.getSenderId() != 0) {
            User sender = userRepository.findById(chatMessage.getSenderId()).orElse(null);
            if (sender != null) {
                chatMessage.setSender(sender.getUsername());
            }
        }
        if (chatMessage.getReceiverId() != 0) {
            User recipient = userRepository.findById(chatMessage.getReceiverId()).orElse(null);
            if (recipient != null) {
                chatMessage.setRecipient(recipient.getUsername());
            }
        }

        messagingService.sendMessage(chatMessage);
    }

    @MessageMapping("/match/{matchId}/reaction")
    public void handleReaction(
            @Payload ChatMessage reactionMessage,
            @DestinationVariable int matchId
    ) {
        reactionMessage.setMatchId(matchId);
        reactionMessage.setType(MessageType.REACTION);
        reactionMessage.setTimestamp(LocalDateTime.now());

        if (reactionMessage.getSenderId() != 0) {
            User sender = userRepository.findById(reactionMessage.getSenderId()).orElse(null);
            if (sender != null) {
                reactionMessage.setSender(sender.getUsername());
            }
        }

        messagingService.handleReaction(reactionMessage);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage chatMessage) {
        chatMessage.setType(MessageType.JOIN);
        chatMessage.setTimestamp(LocalDateTime.now());
        if (chatMessage.getSenderId() != 0) {
            User sender = userRepository.findById(chatMessage.getSenderId()).orElse(null);
            if (sender != null) {
                chatMessage.setSender(sender.getUsername());
            }
        }
        messagingTemplate.convertAndSend("/topic/public", chatMessage);
    }
}