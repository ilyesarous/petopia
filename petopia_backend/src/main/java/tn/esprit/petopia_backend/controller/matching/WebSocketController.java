package tn.esprit.petopia_backend.controller.matching;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
//import tn.esprit.petopia_backend.entities.matching.ChatMessage;
import tn.esprit.petopia_backend.entities.user.ChatMessage;
import tn.esprit.petopia_backend.services.matching.MessagingService;

@Controller
public class WebSocketController {
    @Autowired
    private MessagingService messagingService;


    @MessageMapping("/match/{matchId}")
    public void handleMessage(@DestinationVariable String matchId, @Payload ChatMessage message) {
        int matchIdInt = Integer.parseInt(matchId);
        message.setMatchId(matchIdInt);
        messagingService.sendMessage(message);
    }
}
