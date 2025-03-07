package tn.esprit.petopia_backend.controller.adoptions;

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
public class ShelterController {

    private final IShelterService shelterService;

    public ShelterController(IShelterService shelterService) {
        this.shelterService = shelterService;
    }

    // Only a shelter (i.e. a user with ROLE_SHELTER) can add its shelter details
    @PostMapping("/addShelter")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<Shelter> createShelter(@RequestBody Shelter shelter) {
        // Extract userId from token (e.g. from SecurityContextHolder)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal(); // cast to your entity class
        Integer userId = user.getId_user();

        Shelter savedShelter = shelterService.createShelter(shelter, userId);
        return ResponseEntity.ok(savedShelter);
    }


    // Only a shelter can update its details
    @PutMapping("/updateShelter/{id}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<Shelter> updateShelter(@PathVariable Integer id, @RequestBody Shelter shelter) {
        shelter.setId_shelter(id);
        return ResponseEntity.ok(shelterService.updateShelter(shelter));
    }

    // Only a shelter can delete its details
    @DeleteMapping("/deleteShelter/{id}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<Void> deleteShelter(@PathVariable Integer id) {
        shelterService.deleteShelter(id);
        return ResponseEntity.ok().build();
    }

    // Accessible by shelter or admin to view a specific shelter
    @GetMapping("/getShelter/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SHELTER','ROLE_ADMIN')")
    public ResponseEntity<Shelter> getShelterById(@PathVariable Integer id) {
        return ResponseEntity.ok(shelterService.getShelterById(id));
    }

    // Only admin can view all shelters
    @GetMapping("/getAllShelters")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Shelter>> getAllShelters() {
        return ResponseEntity.ok(shelterService.getAllShelters());
    }

    // Accessible by shelter or admin: retrieve shelter by associated user id
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_SHELTER','ROLE_ADMIN')")
    public ResponseEntity<Shelter> getShelterByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(shelterService.getShelterByUserId(userId));
    }
}
