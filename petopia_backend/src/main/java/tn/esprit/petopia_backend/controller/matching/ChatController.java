package tn.esprit.petopia_backend.controller.matching;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import tn.esprit.petopia_backend.entities.user.ChatMessage;
import tn.esprit.petopia_backend.services.matching.MessagingService;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessagingService messagingService;

    @MessageMapping("/user/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(
            @Payload ChatMessage chatMessage
    ) {
        return chatMessage;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.sendPrivateMessage")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        // Save the message
        messagingService.sendMessage(chatMessage);

        // Send to both sender and recipient
        messagingTemplate.convertAndSendToUser(
                String.valueOf(chatMessage.getRecipient()),
                "/queue/private-" + chatMessage.getMatchId(),
                chatMessage
        );
        messagingTemplate.convertAndSendToUser(
                String.valueOf(chatMessage.getSender()),
                "/queue/private-" + chatMessage.getMatchId(),
                chatMessage
        );
    }
}