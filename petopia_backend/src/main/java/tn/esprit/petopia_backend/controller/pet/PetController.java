package tn.esprit.petopia_backend.controller.pet;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.adoptions.Shelter;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.pet.PetStatus;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.services.adoptions.IShelterService;
import tn.esprit.petopia_backend.services.pet.PetService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class PetController {

    private final PetService petService;
    private final IShelterService shelterService;
    public PetController(PetService petService,IShelterService shelterService) {
        this.petService = petService;
        this.shelterService= shelterService;
    }

    @PostMapping("/user/pet/add")
    public String createPet(@RequestBody Pet pet) {
        petService.addPet(pet);
        return "Pet added successfully";
    }

    //Amalllllllll zedt hedhi

    @PostMapping("/shelter/pet/add")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<String> addPetForShelter(@RequestBody Pet pet) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Shelter shelter = shelterService.getShelterByUserId(user.getId_user());
        if (shelter == null) {
            return ResponseEntity.badRequest().body("No shelter associated with this user");
        }
        pet.setShelter(shelter);

        pet.setUser(null);
        petService.addPet(pet);
        return ResponseEntity.ok("Pet added for shelter successfully");
    }
    @PutMapping("/pet/update/{id}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<Pet> updatePet(@PathVariable Integer id, @RequestBody Pet pet) {
        pet.setIdPet(id);
        Pet updatedPet = petService.updatePet(pet);
        return ResponseEntity.ok(updatedPet);
    }


    // Endpoint for deleting a pet (only accessible by shelters)
    @DeleteMapping("/pet/delete/{id}")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<Void> deletePet(@PathVariable Integer id) {
        petService.deletePet(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/pet/get/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_SHELTER', 'ROLE_ADMIN')")
    public ResponseEntity<Pet> getPetById(@PathVariable Integer id) {
        Pet pet = petService.getPetById(id);
        if (pet == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pet);
    }

    @GetMapping("/pet/shelter/{shelterId}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_SHELTER','ROLE_ADMIN')")
    public ResponseEntity<List<Pet>> getPetsByShelterId(@PathVariable Integer shelterId) {
        return ResponseEntity.ok(petService.getPetsByShelterId(shelterId));
    }

    @GetMapping("/pet/owner/{ownerId}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_ADMIN')")
    public ResponseEntity<List<Pet>> getPetsByOwnerId(@PathVariable Integer ownerId) {
        return ResponseEntity.ok(petService.getPetsByOwnerId(ownerId));
    }

    @GetMapping("/pet/status/{status}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_SHELTER','ROLE_ADMIN')")
    public ResponseEntity<List<Pet>> getPetsByStatus(@PathVariable PetStatus status) {
        return ResponseEntity.ok(petService.getPetsByStatus(status));
    }
}