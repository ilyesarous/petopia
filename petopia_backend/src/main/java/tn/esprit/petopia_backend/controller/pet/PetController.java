package tn.esprit.petopia_backend.controller.pet;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.pet.PetStatus;
import tn.esprit.petopia_backend.services.pet.PetService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @PostMapping("/user/pet/add")
    public String createPet(@RequestBody Pet pet) {
        petService.addPet(pet);
        return "Pet added successfully";
    }

    //Amalllllllll zedt hedhi

    @PostMapping("/pet/add")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_SHELTER')")
    public ResponseEntity<String> createPetV2(@RequestBody Pet pet) {
        petService.addPet(pet);
        return ResponseEntity.ok("Pet added successfully");
    }

    @GetMapping("/shelter/{shelterId}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_SHELTER','ROLE_ADMIN')")
    public ResponseEntity<List<Pet>> getPetsByShelterId(@PathVariable Integer shelterId) {
        return ResponseEntity.ok(petService.getPetsByShelterId(shelterId));
    }

    @GetMapping("/owner/{ownerId}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    public ResponseEntity<List<Pet>> getPetsByOwnerId(@PathVariable Integer ownerId) {
        return ResponseEntity.ok(petService.getPetsByOwnerId(ownerId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_SHELTER','ROLE_ADMIN')")
    public ResponseEntity<List<Pet>> getPetsByStatus(@PathVariable PetStatus status) {
        return ResponseEntity.ok(petService.getPetsByStatus(status));
    }
}