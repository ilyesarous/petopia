package tn.esprit.petopia_backend.controller.event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.event.Participation;
import tn.esprit.petopia_backend.entities.event.ServiceAnimal;
import tn.esprit.petopia_backend.services.event.ParticipationServiceImplement;
import tn.esprit.petopia_backend.services.event.ServiceAnimalImplement;

import java.util.List;

@RestController
@RequestMapping("/user/ServiceAnimal")
public class ServiceAnimalController {

    @Autowired
    private ServiceAnimalImplement serviceAnimalImplement;

    // Récupérer toutes les Services Animals
    // http://localhost:8082/petopia/user/ServiceAnimal/getAllServiceAnimals
    @GetMapping("/getAllServiceAnimals")
    public List<ServiceAnimal> getAllServiceAnimals() {
        return serviceAnimalImplement.getAllServiceAnimals();
    }

    // Récupérer un service Animal par ID
    // http://localhost:8082/petopia/user/ServiceAnimal/display/1
    @GetMapping("/display/{id}")
    public ResponseEntity<ServiceAnimal> getServiceAnimalById(@PathVariable Long id) {
        return serviceAnimalImplement.getServiceAnimalById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //Ajouter un nouveau service
    // http://localhost:8082/petopia/user/ServiceAnimal/addServiceAnimal
    @PostMapping("/addServiceAnimal")
    public ResponseEntity<ServiceAnimal> createServiceAnimal(@RequestBody ServiceAnimal serviceAnimal) {
        ServiceAnimal createdServiceAnimal = serviceAnimalImplement.createServiceAnimal(serviceAnimal);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdServiceAnimal);
    }

    //Modifier un service Animal existante
    // http://localhost:8082/petopia/user/ServiceAnimal/updateServiceAnimal/1
    @PutMapping("/updateServiceAnimal/{id}")
    public ResponseEntity<ServiceAnimal> updateServiceAnimal(@PathVariable Long id, @RequestBody ServiceAnimal updatedServiceAnimal) {
        try {
            return ResponseEntity.ok(serviceAnimalImplement.updateServiceAnimal(id, updatedServiceAnimal));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Supprimer un service Animal
    // http://localhost:8082/petopia/user/ServiceAnimal/deletServiceAnimal/1
    @DeleteMapping("/deletServiceAnimal/{id}")
    public ResponseEntity<Void> deleteServiceAnimal(@PathVariable Long id) {
        serviceAnimalImplement.deleteServiceAnimal(id);
        return ResponseEntity.noContent().build();
    }
}
