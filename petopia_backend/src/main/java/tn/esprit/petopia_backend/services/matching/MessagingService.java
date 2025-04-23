package tn.esprit.petopia_backend.services.matching;

import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.matching.ChatReaction;
import tn.esprit.petopia_backend.entities.user.ChatMessage;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.matching.ChatMessageRepository;
import tn.esprit.petopia_backend.repositories.matching.ChatReactionRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;

@Service
public class MessagingService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository messageRepository;
    private final ChatReactionRepository reactionRepository;
    private final UserRepository userRepository;

    public MessagingService(
            SimpMessagingTemplate messagingTemplate,
            ChatMessageRepository messageRepository,
            ChatReactionRepository reactionRepository,
            UserRepository userRepository
    ) {
        this.messagingTemplate = messagingTemplate;
        this.messageRepository = messageRepository;
        this.reactionRepository = reactionRepository;
        this.userRepository = userRepository;
    }

    public void sendMessage(ChatMessage chatMessage) {
        try {
            if (chatMessage.getRecipient() == null && chatMessage.getReceiverId() != 0) {
                User recipient = userRepository.findById(chatMessage.getReceiverId()).orElse(null);
                if (recipient != null) {
                    chatMessage.setRecipient(recipient.getUsername());
                } else {
                    System.out.println("Recipient not found for ID: " + chatMessage.getReceiverId());
                }
            }
            ChatMessage savedMessage = messageRepository.save(chatMessage);
            System.out.println("Saved message: " + savedMessage.getId());
            String destination = "/queue/private-" + chatMessage.getMatchId();
            messagingTemplate.convertAndSend(destination, savedMessage);
            System.out.println("Broadcasted to: " + destination);
        } catch (Exception e) {
            System.err.println("Error saving/broadcasting message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void handleReaction(ChatMessage reactionMessage) {
        try {
            ChatMessage originalMessage = messageRepository.findById(reactionMessage.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Message not found: " + reactionMessage.getId()));

            // Vérifier si l'utilisateur a déjà réagi
            boolean alreadyReacted = originalMessage.getReactions().stream()
                    .anyMatch(r -> r.getUserId().equals(reactionMessage.getSenderId()));

            if (!alreadyReacted) {
                ChatReaction reaction = ChatReaction.builder()
                        .message(originalMessage)
                        .userId(reactionMessage.getSenderId())
                        .reaction(reactionMessage.getContent())
                        .build();

                reactionRepository.save(reaction);
                originalMessage.getReactions().add(reaction);
            } else {
                // Mettre à jour la réaction existante
                ChatReaction existingReaction = originalMessage.getReactions().stream()
                        .filter(r -> r.getUserId().equals(reactionMessage.getSenderId()))
                        .findFirst()
                        .orElse(null);
                if (existingReaction != null) {
                    existingReaction.setReaction(reactionMessage.getContent());
                    reactionRepository.save(existingReaction);
                }
            }

            // Sauvegarder le message mis à jour
            messageRepository.save(originalMessage);

            // Recharger le message avec les réactions pour la diffusion
            ChatMessage updatedMessage = messageRepository.findById(reactionMessage.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Message not found: " + reactionMessage.getId()));

            String destination = "/queue/private-" + reactionMessage.getMatchId();
            messagingTemplate.convertAndSend(destination, updatedMessage);
            System.out.println("Reaction broadcasted to: " + destination);
        } catch (Exception e) {
            System.err.println("Error handling reaction: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public List<ChatMessage> getMessagesForMatch(int matchId) {
        List<ChatMessage> messages = messageRepository.findByMatchId(matchId);
        System.out.println("Fetched messages for match " + matchId + ": " + messages.size());
        return messages;
    }
}