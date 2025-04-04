package tn.esprit.petopia_backend.controller.matching;

    import lombok.RequiredArgsConstructor;
    import org.springframework.messaging.handler.annotation.MessageMapping;
    import org.springframework.messaging.handler.annotation.Payload;
    import org.springframework.messaging.handler.annotation.SendTo;
    import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
    import org.springframework.stereotype.Controller;
    import org.springframework.web.bind.annotation.RestController;
    import tn.esprit.petopia_backend.entities.matching.ChatMessage;
    import org.springframework.messaging.simp.SimpMessagingTemplate;

//import tn.esprit.petopia_backend.entities.matching.ChatMessage;


@Controller
@RequiredArgsConstructor
    public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/user/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(
            @Payload ChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        // Add username in web socket session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSenderId());
        return chatMessage;
        // Créer un message de bienvenue
        //  return new ChatMessage("Welcome " + chatMessage.getSender(), "Server", MessageType.JOIN);
    }
    @MessageMapping("/chat.sendMessage") // Public chat
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.sendPrivateMessage") // Private chat
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        messagingTemplate.convertAndSendToUser(chatMessage.getRecipient(), "/queue/messages", chatMessage);
    }
}

