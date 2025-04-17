package tn.esprit.petopia_backend.services.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.entities.vet.Notification;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import tn.esprit.petopia_backend.repositories.vet.NotificationRepository;

import java.util.List;

@Service
public class NotificationServiceImplement implements INotificationService{

    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public Notification addNotification(Notification notification) {
        if (notification.getUser() != null) {
            int userId = notification.getUser().getId_user(); // Récupérer l'ID utilisateur
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                notification.setUser(user); // Associer l'utilisateur à la notification
                return notificationRepository.save(notification);
            }
        }
        return null; // Retourner null si l'utilisateur n'existe pas
    }

    @Override
    public Notification updateNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public void deleteNotification(int idNotification) {
        notificationRepository.deleteById(idNotification);
    }

    @Override
    public List<Notification> retriveAllNotification() {
        return (List<Notification>) notificationRepository.findAll();
    }

    @Override
    public Notification retriveNotification(int idNotification) {
        return notificationRepository.findById(idNotification).orElse(null);
    }

    public List<Notification> getNotificationsByUserId(Integer userId) {
        return notificationRepository.findByUserId(userId);
    }


}
