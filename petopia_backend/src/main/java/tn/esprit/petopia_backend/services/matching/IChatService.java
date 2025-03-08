package tn.esprit.petopia_backend.services.matching;


import tn.esprit.petopia_backend.entities.matching.Chat;

import java.util.List;

public interface IChatService {
    Chat addChat(Chat chat);
    Chat updateChat(Chat chat);
    Chat getChat(int id);
    List<Chat> getAllChat();
    void deleteChat(int id);
}
