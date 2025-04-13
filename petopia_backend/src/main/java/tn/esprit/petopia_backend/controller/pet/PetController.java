package tn.esprit.petopia_backend.controller.pet;


import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.controller.matching.MatchRequest;
import tn.esprit.petopia_backend.entities.adoptions.Shelter;
import tn.esprit.petopia_backend.entities.matching.MatchStatus;
import tn.esprit.petopia_backend.entities.matching.Matches;
import tn.esprit.petopia_backend.entities.matching.Preferences;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.pet.PetStatus;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.services.adoptions.IShelterService;
import tn.esprit.petopia_backend.services.matching.MatchesService;
import tn.esprit.petopia_backend.services.pet.PetService;

import java.util.Base64;
import java.util.HashMap;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class PetController {

    @Autowired
    private MatchesService matchesService;
    @Autowired
    private final PetService petService;
    @Autowired
    private final IShelterService shelterService;
    public PetController(PetService petService,IShelterService shelterService) {
        this.petService = petService;
        this.shelterService= shelterService;
    }

    @PostMapping("/user/pet/add")
    public ResponseEntity<Map<String, String>> addPet(@RequestBody Pet pet) {
        petService.addPet(pet);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Pet added successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/pet/all")
    public ResponseEntity<List<Pet>> getAllPets() {
        List<Pet> pets = petService.getallPets();
        pets.forEach(pet -> {
            if (pet.getPetImageBytes() != null) {
                String base64Image = "data:image/png;base64," + Base64.getEncoder().encodeToString(pet.getPetImageBytes());
                pet.setPetImage(base64Image);
            }
        });
        if (pets.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(pets);
    }



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
    @PreAuthorize("hasAnyAuthority('ROLE_SHELTER','ROLE_USER')")
    public ResponseEntity<Pet> updatePet(@PathVariable Integer id, @RequestBody Pet pet) {
        pet.setIdPet(id);
        Pet updatedPet = petService.updatePet(pet);
        return ResponseEntity.ok(updatedPet);
    }

    // Endpoint for deleting a pet (only accessible by shelters)
    @DeleteMapping("/pet/delete/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SHELTER','ROLE_USER')")
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
    @GetMapping("/pet/unassigned")
    @PreAuthorize("hasAnyAuthority('ROLE_USER','ROLE_SHELTER','ROLE_ADMIN')")
    public ResponseEntity<List<Pet>> getUnassignedPets() {
        return ResponseEntity.ok(petService.getUnassignedPets());
    }

    // anas bdet tekhdem hmd welyeeeyyyyy

    @GetMapping("/user/pet/{petId}/check-preferences")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<PetPreferencesResponse> checkPetPreferences(@PathVariable int petId) {
        Pet pet = petService.getPetById(petId);

        if (pet == null) {
            return ResponseEntity.notFound().build();
        }

        boolean hasPreferences = pet.getPreferences() != null;
        List<Pet> matchingPets = null;

        if (hasPreferences) {
            matchingPets = petService.getPetsByStatus(PetStatus.AVAILABLE)
                    .stream()
                    .filter(p -> matchesPreferences(p, pet.getPreferences()))
                    .collect(Collectors.toList());
        }

        PetPreferencesResponse response = new PetPreferencesResponse(
                pet.getIdPet(),
                pet.getPetName(),
                hasPreferences,
                pet.getPreferences(),
                matchingPets
        );

        return ResponseEntity.ok(response);
    }

    private boolean matchesPreferences(Pet pet, Preferences preferences) {
        return (preferences.getPreferred_breed() == null || pet.getBreed().equalsIgnoreCase(preferences.getPreferred_breed())) &&
                (pet.getPetAge() >= preferences.getMin_age() && pet.getPetAge() <= preferences.getMax_age()) &&
                (preferences.getPreferred_gender() == null || pet.getGender().toString().equalsIgnoreCase(preferences.getPreferred_gender())) &&
                (preferences.getPreferred_location() == null || pet.getLocation().equalsIgnoreCase(preferences.getPreferred_location()));
    }

    @GetMapping("/user/pet/{petId}/matching-pets")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<Pet>> getMatchingPetsOnly(@PathVariable int petId) {
        // Récupérer le pet par son ID
        Pet pet = petService.getPetById(petId);

        // Vérifier si le pet existe
        if (pet == null) {
            return ResponseEntity.notFound().build();
        }

        // Vérifier si le pet a des préférences
        if (pet.getPreferences() == null) {
            return ResponseEntity.ok(Collections.emptyList()); // Renvoie une liste vide si pas de préférences
        }

        // Trouver les pets correspondants aux préférences
        List<Pet> matchingPets = petService.getPetsByStatus(PetStatus.AVAILABLE)
                .stream()
                .filter(p -> p.getIdPet() != pet.getIdPet()) // Correction : utiliser != au lieu de equals()
                .filter(p -> matchesPreferences(p, pet.getPreferences()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(matchingPets);
    }

    @GetMapping("/auth/pet/ref/{petRefVet}")
    public ResponseEntity<Pet> getPetByRefVet(@PathVariable int petRefVet) {
        Pet pet = petService.getPetByRefVet(petRefVet);
        if (pet == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pet);
    }


}