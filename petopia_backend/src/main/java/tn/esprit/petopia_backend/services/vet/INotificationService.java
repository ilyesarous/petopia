package tn.esprit.petopia_backend.services.vet;

import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.entities.vet.Notification;

import java.util.List;

public interface INotificationService {
    Notification addNotification(Notification notification);
    Notification updateNotification(Notification notification);
    void deleteNotification(int idNotification);
    List<Notification> retriveAllNotification();
    Notification retriveNotification(int idNotification);
    List<Notification> getNotificationsByUserId(Integer userId);
    void createNotificationCommunity(User user, String message);
}
