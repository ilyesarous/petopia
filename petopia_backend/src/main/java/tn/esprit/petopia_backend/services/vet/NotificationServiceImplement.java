package tn.esprit.petopia_backend.services.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.vet.Notification;
import tn.esprit.petopia_backend.repositories.vet.NotificationRepository;

import java.util.List;

@Service
public class NotificationServiceImplement implements INotificationService{

    @Autowired
    private NotificationRepository notificationRepository;
    @Override
    public Notification addNotification(Notification notification) {
        return notificationRepository.save(notification);
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
}
