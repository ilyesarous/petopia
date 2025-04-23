package tn.esprit.petopia_backend.controller.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.entities.event.ServiceAnimal;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.services.event.ServiceAnimalImplement;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/ServiceAnimal")
@CrossOrigin(origins = "http://localhost:4200")
public class ServiceAnimalController {

    @Autowired
    private ServiceAnimalImplement serviceAnimalImplement;


    // Récupérer toutes les Services Animals
    // http://localhost:8082/petopia/user/ServiceAnimal/getAllServiceAnimals

    @GetMapping("/getAllServiceAnimals")
    @PreAuthorize("hasAuthority('ROLE_USER')")

    public List<ServiceAnimal> getAllServiceAnimals() {
        return serviceAnimalImplement.getAllServiceAnimals();
    }

    // Récupérer un service Animal par ID
    // http://localhost:8082/petopia/user/ServiceAnimal/display/1
    @GetMapping("/display/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER')")

    public ResponseEntity<ServiceAnimal> getServiceAnimalById(@PathVariable Long id) {
        return serviceAnimalImplement.getServiceAnimalById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //Ajouter un nouveau service
    // http://localhost:8082/petopia/user/ServiceAnimal/addServiceAnimal

    @PostMapping(value = "/addServiceAnimal", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<?> createServiceAnimal(
            @RequestPart("serviceAnimal") String serviceAnimalStr,
            @RequestParam(value = "logoFile", required = false) MultipartFile logoFile,
            Authentication authentication) {

        try {
            Object principal = authentication.getPrincipal();
            if (!(principal instanceof User)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access.");
            }

            User user = (User) principal;
            Integer userId = user.getId_user();

            // Convert JSON string to ServiceAnimal object
            ObjectMapper objectMapper = new ObjectMapper();
            ServiceAnimal serviceAnimal = objectMapper.readValue(serviceAnimalStr, ServiceAnimal.class);



            ServiceAnimal createdServiceAnimal = serviceAnimalImplement.createServiceAnimal(serviceAnimal, userId,logoFile);
            return ResponseEntity.ok(createdServiceAnimal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating service: " + e.getMessage());
        }

    }





    //Modifier un service Animal existante
    // http://localhost:8082/petopia/user/ServiceAnimal/updateServiceAnimal/1
    @PutMapping("/updateServiceAnimal/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER')")

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
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Void> deleteServiceAnimal(@PathVariable Long id) {
        serviceAnimalImplement.deleteServiceAnimal(id);
        return ResponseEntity.noContent().build();
    }


}
