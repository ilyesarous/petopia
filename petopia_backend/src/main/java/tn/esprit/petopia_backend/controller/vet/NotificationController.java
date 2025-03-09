package tn.esprit.petopia_backend.controller.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.vet.Notification;
import tn.esprit.petopia_backend.services.vet.INotificationService;

import java.util.List;

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
}
