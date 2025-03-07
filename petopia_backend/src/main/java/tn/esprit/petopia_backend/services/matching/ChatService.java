package tn.esprit.petopia_backend.services.matching;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.matching.Chat;
import tn.esprit.petopia_backend.repositories.matching.ChatRepository;

import java.util.List;
@Service
public class ChatService implements IChatService{
    @Autowired
    private ChatRepository chatRepository;
    @Override
    public Chat addChat(Chat chat) {
        return chatRepository.save(chat);
    }

    @Override
    public Chat updateChat(Chat chat) {
        return chatRepository.save(chat);
    }

    @Override
    public Chat getChat(int id) {
        return chatRepository.findById(id).get();
    }

    @Override
    public List<Chat> getAllChat() {
        return chatRepository.findAll();
    }

    @Override
    public void deleteChat(int id) {
        chatRepository.deleteById(id);

    }
}
