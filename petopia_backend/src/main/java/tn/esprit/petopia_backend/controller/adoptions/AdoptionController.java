package tn.esprit.petopia_backend.controller.adoptions;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.adoptions.Adoption;
import tn.esprit.petopia_backend.entities.adoptions.AdoptionStatus;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.services.adoptions.IAdoptionService;
import java.util.List;

@RestController
@RequestMapping("/adoptions")
public class AdoptionController {

    private final IAdoptionService adoptionService;

    public AdoptionController(IAdoptionService adoptionService) {
        this.adoptionService = adoptionService;
    }

    @PostMapping("/addAdoption")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Adoption> createAdoption(@RequestBody Adoption adoption) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal(); // authenticated user
        Integer userId = user.getId_user();

        Adoption createdAdoption = adoptionService.createAdoption(adoption, userId);
        return ResponseEntity.ok(createdAdoption);
    }


    @PutMapping("/updateAdoption/{id}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<Adoption> updateAdoption(@PathVariable Integer id, @RequestBody Adoption adoption) {
        Adoption updatedAdoption = adoptionService.updateAdoption(id, adoption);
        return ResponseEntity.ok(updatedAdoption);
    }

    @DeleteMapping("/deleteAdoption/{id}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<Void> deleteAdoption(@PathVariable Integer id) {
        adoptionService.deleteAdoption(id);
        return ResponseEntity.ok().build();
    }

    // Both shelter and user can view a specific adoption
    @GetMapping("/getAdoption/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_SHELTER')")
    public ResponseEntity<Adoption> getAdoptionById(@PathVariable Integer id) {
        return ResponseEntity.ok(adoptionService.getAdoptionById(id));
    }

    // Only admin can get all adoptions
    @GetMapping("/getAllAdoptions")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Adoption>> getAllAdoptions() {
        return ResponseEntity.ok(adoptionService.getAllAdoptions());
    }

    // A user can view all of his own adoption requests
    @GetMapping("/requester/{requesterId}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<Adoption>> getAdoptionsByRequesterId(@PathVariable Integer requesterId) {
        return ResponseEntity.ok(adoptionService.getAdoptionsByRequesterId(requesterId));
    }

    // A shelter can view adoption requests sent to it
    @GetMapping("/shelter/{shelterId}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<List<Adoption>> getAdoptionsByShelterId(@PathVariable Integer shelterId) {
        return ResponseEntity.ok(adoptionService.getAdoptionsByShelterId(shelterId));
    }

    // Both shelter and user can filter adoptions by status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_SHELTER')")
    public ResponseEntity<List<Adoption>> getAdoptionsByStatus(@PathVariable AdoptionStatus status) {
        return ResponseEntity.ok(adoptionService.getAdoptionsByStatus(status));
    }

    // Accessible by both roles (role not specified)
    @GetMapping("/pet/{petId}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_SHELTER')")
    public ResponseEntity<List<Adoption>> getAdoptionsByPetId(@PathVariable Integer petId) {
        return ResponseEntity.ok(adoptionService.getAdoptionsByPetId(petId));
    }
}
