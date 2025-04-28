package tn.esprit.petopia_backend.controller.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.event.Participation;
import tn.esprit.petopia_backend.entities.event.ReservationService;
import tn.esprit.petopia_backend.entities.event.ServiceAnimal;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.services.event.IEventService;
import tn.esprit.petopia_backend.services.event.IReservationService;
import tn.esprit.petopia_backend.services.event.ReservationServiceImplement;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user/ReservationServiceAnimal")
public class ReservationServiceController {

    @Autowired
    private ReservationServiceImplement reservationServiceImplement;


    // Récupérer toutes les réservations de services
    @GetMapping("/getAllReservations")
    public List<ReservationService> getAllReservations() {
        return reservationServiceImplement.getAllReservations();
    }

    // Récupérer une réservation par ID
    @GetMapping("/display/{id}")
    public ResponseEntity<ReservationService> getReservationById(@PathVariable Long id) {
        Optional<ReservationService> reservationService = reservationServiceImplement.getReservationById(id);
        return reservationService.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Ajouter une nouvelle réservation de service
    // http://localhost:8082/petopia/user/ReservationServiceAnimal/addReservation
    @PostMapping("/addReservation")
    public ResponseEntity<ReservationService> createReservation(@RequestBody ReservationService reservationService) {
        ReservationService createdReservation = reservationServiceImplement.createReservation(reservationService);


        return ResponseEntity.ok(createdReservation);
    }

    // Modifier une réservation existante
    // http://localhost:8082/petopia/user/ReservationServiceAnimal/updateReservation/1
    @PutMapping("/updateReservation/{id}")
    public ResponseEntity<ReservationService> updateReservation(@PathVariable Long id, @RequestBody ReservationService updatedReservation) {
        try {
            return ResponseEntity.ok(reservationServiceImplement.updateReservation(id, updatedReservation));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer une réservation
    @DeleteMapping("/deleteReservation/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationServiceImplement.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }








}
