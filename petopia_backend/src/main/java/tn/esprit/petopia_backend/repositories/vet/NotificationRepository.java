package tn.esprit.petopia_backend.repositories.vet;

import org.springframework.data.repository.CrudRepository;
import tn.esprit.petopia_backend.entities.vet.Notification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends CrudRepository<Notification,Integer> {
    @Query("SELECT n FROM Notification n WHERE n.user.id_user = :userId")
    List<Notification> findByUserId(@Param("userId") Integer userId);

}
