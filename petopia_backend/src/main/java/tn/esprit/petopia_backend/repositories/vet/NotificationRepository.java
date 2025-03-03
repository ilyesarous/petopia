package tn.esprit.petopia_backend.repositories.vet;

import org.springframework.data.repository.CrudRepository;
import tn.esprit.petopia_backend.entities.vet.Notification;

public interface NotificationRepository extends CrudRepository<Notification,Integer> {
}
