package tn.esprit.petopia_backend.controller.adoptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.adoptions.Shelter;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.services.adoptions.IShelterService;
import java.util.List;

@RestController
@RequestMapping("/shelters")
@CrossOrigin(origins = "http://localhost:4200")

public class ShelterController {

    private final IShelterService shelterService;

    public ShelterController(IShelterService shelterService) {
        this.shelterService = shelterService;
    }

    @PostMapping("/addShelter")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<?> createShelter(@RequestBody Shelter shelter) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access.");
        }

        User user = (User) principal;
        Integer userId = user.getId_user();

        try {
            Shelter createdShelter = shelterService.createShelter(shelter, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdShelter);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating the shelter: " + e.getMessage());
        }
    }



    @PutMapping("/updateShelter/{id}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<?> updateShelter(@PathVariable Integer id, @RequestBody Shelter shelter) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access.");
        }

        User user = (User) principal;

        try {
            // Verify the shelter exists and belongs to the authenticated user
            Shelter existingShelter = shelterService.getShelterById(id);
            if (!existingShelter.getUser().getId_user().equals(user.getId_user())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You can only update your own shelter.");
            }

            shelter.setId_shelter(id);
            // Pass the user ID from token to service layer for additional validation
            Shelter updatedShelter = shelterService.updateShelter(shelter, user.getId_user());
            return ResponseEntity.ok(updatedShelter);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the shelter: " + e.getMessage());
        }
    }
    @DeleteMapping("/deleteShelter/{id}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<String> deleteShelter(@PathVariable Integer id) {
        try {
            shelterService.deleteShelter(id);
            return ResponseEntity.ok("Shelter deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Shelter not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the shelter.");
        }
    }


    @GetMapping("/getShelter/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SHELTER','ROLE_ADMIN')")
    public ResponseEntity<Shelter> getShelterById(@PathVariable Integer id) {
        return ResponseEntity.ok(shelterService.getShelterById(id));
    }

    @GetMapping("/getAllShelters")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Shelter>> getAllShelters() {
        return ResponseEntity.ok(shelterService.getAllShelters());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SHELTER','ROLE_ADMIN')")
    public ResponseEntity<Shelter> getShelterByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(shelterService.getShelterByUserId(userId));
    }
}
