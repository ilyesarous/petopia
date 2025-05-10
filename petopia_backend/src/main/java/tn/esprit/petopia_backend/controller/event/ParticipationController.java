package tn.esprit.petopia_backend.controller.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.dto.ParticipationResponseDTO;
import tn.esprit.petopia_backend.entities.event.Enum.ParticipationStatus;
import tn.esprit.petopia_backend.entities.event.Participation;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.services.event.ParticipationServiceImplement;
import tn.esprit.petopia_backend.services.user.UserService;

import java.util.List;

@RestController
@RequestMapping("/participations")
@CrossOrigin(origins = "http://angular-service:4200") // front Angular

public class ParticipationController {
    @Autowired
    private ParticipationServiceImplement participationService;
    @Autowired
    private UserService userService;

    // Récupérer toutes les participations
    // http://localhost:8082/petopia/user/participations/getAllParticipations
    @GetMapping("/getAllParticipations")
    @PreAuthorize("hasAnyAuthority('ROLE_USER')")
    public List<Participation> getAllParticipations() {
        return participationService.getAllParticipations();
    }

    // Récupérer une participation par ID
    @GetMapping("/display/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER')")
    public List<Participation> getParticipationById(@PathVariable int id) {
        return participationService.getUserParticipations(id);
    }

    //Ajouter une nouvelle participation
    // http://localhost:8082/petopia/user/participations/addParticipation
     @PostMapping("/addParticipation")
    @PreAuthorize("hasAnyAuthority('ROLE_USER')")
    public ResponseEntity<Participation> createParticipation(@RequestBody Participation participation) {
        System.out.println(participation);
        Participation createdParticipation = participationService.createParticipation(participation);
       /* User user = userService.getUsersById(participation.getParticipant().getId_user()).getOurUsers();
        participation.setParticipant(user);*/
         // Ajouter des XP et vérifier les niveaux
         userService.addXp(participation.getParticipant().getId_user(), 50); // 50 XP par participation
        return ResponseEntity.ok(createdParticipation);
    }




    // Modifiez la méthode addParticipation
    /*@PostMapping("/addParticipation")
    @PreAuthorize("hasAnyAuthority('ROLE_USER')")
    public ResponseEntity<ParticipationResponseDTO> createParticipation(@RequestBody Participation participation) {
        Participation createdParticipation = participationService.createParticipation(participation);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ParticipationResponseDTO(createdParticipation));
    }*/

    // Ajoutez une méthode pour récupérer le temps restant
    @GetMapping("/time-remaining/{participationId}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER')")
    public ResponseEntity<Long> getTimeRemaining(@PathVariable Long participationId) {
        Long timeRemaining = participationService.getTimeRemaining(participationId);
        return ResponseEntity.ok(timeRemaining);
    }









    //Modifier une participation existante
    @PutMapping("/updateParticipation/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    public ResponseEntity<Participation> updateParticipation(@PathVariable Long id, @RequestBody Participation updatedParticipation) {
        try {
            return ResponseEntity.ok(participationService.updateParticipation(id, updatedParticipation));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer une participation
    @DeleteMapping("/deletParticipation/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER')")
    public ResponseEntity<Void> deleteParticipation(@PathVariable Long id) {
        participationService.deleteParticipation(id);
        return ResponseEntity.noContent().build();
    }

    // Ajoutez cette méthode

    @GetMapping("/displayPartiByEvent/{eventId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")

    public ResponseEntity<List<Participation>> getParticipationsByEvent(@PathVariable Long eventId) {
        List<Participation> participations = participationService.getParticipationsByEventId(eventId);
        return ResponseEntity.ok(participations);
    }
// Ajoutez ces endpoints à votre contrôleur existant

    // Pour l'admin - Récupérer les participations en attente
    @GetMapping("/pending")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Participation>> getPendingParticipations() {
        List<Participation> pending = participationService.getParticipationsByStatus(ParticipationStatus.PENDING);
        return ResponseEntity.ok(pending);
    }

    // Pour l'admin - Valider/Refuser une participation
    @PutMapping("/validate/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Participation> validateParticipation(
            @PathVariable Long id,
            @RequestParam ParticipationStatus status) {
        try {
            Participation updated = participationService.updateParticipationStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Pour l'utilisateur - Récupérer ses participations
    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER')")
    public ResponseEntity<List<Participation>> getUserParticipations(@PathVariable Integer userId) {
        List<Participation> participations = participationService.getUserParticipations(userId);
        return ResponseEntity.ok(participations);
    }

    @GetMapping("/check-participation/{userId}/{eventId}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER')")
    public ResponseEntity<Boolean> checkUserParticipation(
            @PathVariable Integer userId,
            @PathVariable Long eventId) {
        boolean exists = participationService.checkUserParticipation(userId, eventId);
        return ResponseEntity.ok(exists);
    }


}
