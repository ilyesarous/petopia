package tn.esprit.petopia_backend.controller.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.vet.Notification;
import tn.esprit.petopia_backend.services.vet.INotificationService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth/Notification")
public class NotificationController {

    @Autowired
    INotificationService notificationService;

    @PostMapping("/addNotification")
    Notification addNotification(@RequestBody Notification notification){
        return notificationService.addNotification(notification);
    }

    @PutMapping("/updateNotification")
    Notification updateNotification(@RequestBody Notification notification){
        return notificationService.updateNotification(notification);
    }

    @PutMapping("/updateNotificationStatus/{idNotification}")
    public ResponseEntity<Void> updateNotificationStatus(
            @PathVariable int idNotification,
            @RequestBody Map<String, Boolean> requestBody) { // Utilisez un Map pour récupérer le corps de la requête
        Boolean seen = requestBody.get("seen");
        if (seen != null) {
            Notification notification = notificationService.retriveNotification(idNotification);
            if (notification != null) {
                notification.setSeen(seen);
                notificationService.updateNotification(notification);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/deleteNotification/{idNotification}")
    void deleteNotification(@PathVariable int idNotification){
        notificationService.deleteNotification(idNotification);
    }

    @GetMapping("/retriveAllNotification")
    List<Notification> retriveAllNotification(){
        return notificationService.retriveAllNotification();
    }

    @GetMapping("/retriveNotification/{idNotification}")
    Notification retriveNotification(@PathVariable int idNotification){
        return notificationService.retriveNotification(idNotification);
    }

    @GetMapping("/retrieveUserNotifications/{userId}")
    public ResponseEntity<List<Notification>> retrieveUserNotifications(@PathVariable Integer userId) {
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }


}
