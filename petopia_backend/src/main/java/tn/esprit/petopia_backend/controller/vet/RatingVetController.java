package tn.esprit.petopia_backend.controller.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.vet.Rating_Vet;
import tn.esprit.petopia_backend.services.vet.IRating_VetService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class RatingVetController {

    @Autowired
    IRating_VetService ratingVetService;

    @PostMapping("/auth/ratingVet/addRatingVet")
    public Rating_Vet addRatingVet(@RequestBody Rating_Vet rating){
        return ratingVetService.addRatingVet(rating);
    }

    @DeleteMapping("/auth/ratingVet/deleteRatingVet/{idRatingVet}")
    void deleteRatingVet(@PathVariable int idRatingVet){
        ratingVetService.deleteRatingVet(idRatingVet);
    }

    @GetMapping("/auth/ratingVet/retriveAllRatingVet")
    List<Rating_Vet> retriveAllRatingVet(){
        return ratingVetService.retrieveAllRatingVet();
    }

    @GetMapping("/auth/ratingVet/retriveRatingVet/{idRatingVet}")
    Rating_Vet retriveRatingVet(@PathVariable int idRatingVet){
        return ratingVetService.retrieveRatingVet(idRatingVet);
    }

    @GetMapping("/auth/ratingVet/retrieveRatingVetByUser/{userId}")
    public ResponseEntity<List<Rating_Vet>> getRatingVetByUser(@PathVariable Integer userId) {
        List<Rating_Vet> rating = ratingVetService.getRatingVetByUserId(userId);
        return ResponseEntity.ok(rating);
    }
}
