    package tn.esprit.petopia_backend.controller.matching;

    import org.springframework.messaging.handler.annotation.MessageMapping;
    import org.springframework.messaging.handler.annotation.Payload;
    import org.springframework.messaging.handler.annotation.SendTo;
    import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
    import org.springframework.web.bind.annotation.RestController;
    import tn.esprit.petopia_backend.entities.matching.ChatMessage;
    //import tn.esprit.petopia_backend.entities.matching.ChatMessage;


    @RestController
    public class ChatController {

        @MessageMapping("/user/chat.sendMessage")
        @SendTo("/topic/public")
        public ChatMessage sendMessage(
                @Payload ChatMessage chatMessage
        ) {
            return chatMessage;
        }

        @MessageMapping("/user/chat.addUser")
        @SendTo("/topic/public")
        public ChatMessage addUser(
                @Payload ChatMessage chatMessage,
                SimpMessageHeaderAccessor headerAccessor
        ) {
            headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
            return chatMessage;
        }

    }