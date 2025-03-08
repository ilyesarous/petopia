package tn.esprit.petopia_backend.controller.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.event.Participation;
import tn.esprit.petopia_backend.services.event.ParticipationServiceImplement;

import java.util.List;

@RestController
@RequestMapping("/user/participations")

public class ParticipationController {
    @Autowired
    private ParticipationServiceImplement participationService;

    // Récupérer toutes les participations
    @GetMapping("/getAllParticipations")
    public List<Participation> getAllParticipations() {
        return participationService.getAllParticipations();
    }

    // Récupérer une participation par ID
    @GetMapping("/display/{id}")
    public ResponseEntity<Participation> getParticipationById(@PathVariable Long id) {
        return participationService.getParticipationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //Ajouter une nouvelle participation
    @PostMapping("/addParticipation")
    public ResponseEntity<Participation> createParticipation(@RequestBody Participation participation) {
        Participation createdParticipation = participationService.createParticipation(participation);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdParticipation);
    }

    //Modifier une participation existante
    @PutMapping("/updateParticipation/{id}")
    public ResponseEntity<Participation> updateParticipation(@PathVariable Long id, @RequestBody Participation updatedParticipation) {
        try {
            return ResponseEntity.ok(participationService.updateParticipation(id, updatedParticipation));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer une participation
    @DeleteMapping("/deletParticipation/{id}")
    public ResponseEntity<Void> deleteParticipation(@PathVariable Long id) {
        participationService.deleteParticipation(id);
        return ResponseEntity.noContent().build();
    }

}
