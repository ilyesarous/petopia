package tn.esprit.petopia_backend.controller.pet;


import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.controller.matching.MatchRequest;
import tn.esprit.petopia_backend.entities.adoptions.Shelter;
import tn.esprit.petopia_backend.entities.matching.MatchStatus;
import tn.esprit.petopia_backend.entities.matching.Matches;
import tn.esprit.petopia_backend.entities.matching.Preferences;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.pet.PetStatus;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.services.adoptions.IShelterService;
import tn.esprit.petopia_backend.services.community.CloudinaryService;
import tn.esprit.petopia_backend.services.matching.MatchesService;
import tn.esprit.petopia_backend.services.pet.PetService;

import java.io.IOException;
import java.util.*;
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
    @Autowired
    private final CloudinaryService cloudinaryService;

    public PetController(PetService petService,IShelterService shelterService,CloudinaryService cloudinaryService) {
        this.petService = petService;
        this.shelterService= shelterService;
        this.cloudinaryService = cloudinaryService;
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
        if (pets.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(pets);
    }


    @PostMapping("/shelter/pet/add")
    @PreAuthorize("hasAuthority('ROLE_SHELTER')")
    public ResponseEntity<Map<String, String>> addPetForShelter(
            @RequestParam("image") MultipartFile image,
            @RequestParam("petData") String petData) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Shelter shelter = shelterService.getShelterByUserId(user.getId_user());
        if (shelter == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "No shelter associated with this user");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            String imageUrl = cloudinaryService.uploadImage(image);

            ObjectMapper objectMapper = new ObjectMapper();
            Pet pet = objectMapper.readValue(petData, Pet.class);

            pet.setShelter(shelter);
            pet.setPetImage(imageUrl);
            pet.setUser(null);

            petService.addPet(pet);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Pet added for shelter successfully");
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to upload image or parse pet data");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @PutMapping("/pet/updateWithImage/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SHELTER','ROLE_USER')")
    public ResponseEntity<?> updatePetWithImage(@PathVariable Integer id,
                                                @RequestParam(value = "image", required = false) MultipartFile image,
                                                @RequestParam("petData") String petData) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();
            Pet existingPet = petService.getPetById(id);

            if (existingPet == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Pet with ID " + id + " not found.");
            }

            // Check if the shelter is allowed to update the pet
            if (currentUser.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SHELTER"))) {
                Integer shelterIdOfUser = shelterService.getShelterByUserId(currentUser.getId_user()).getId_shelter();
                Integer shelterIdOfPet = Optional.ofNullable(existingPet.getShelter()).map(Shelter::getId_shelter).orElse(null);

                if (!Objects.equals(shelterIdOfPet, shelterIdOfUser)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Permission denied: You can only update pets from your own shelter.");
                }
            }

            ObjectMapper objectMapper = new ObjectMapper();
            Pet updatedPet = objectMapper.readValue(petData, Pet.class);
            updatedPet.setIdPet(id);
            updatedPet.setShelter(existingPet.getShelter());
            updatedPet.setUser(existingPet.getUser());

            if (image != null && !image.isEmpty()) {
                String imageUrl = cloudinaryService.uploadImage(image);
                updatedPet.setPetImage(imageUrl);
            } else {
                updatedPet.setPetImage(existingPet.getPetImage());
            }

            Pet result = petService.updatePet(updatedPet);
            return ResponseEntity.ok(result);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error parsing pet data or uploading image.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error occurred: " + e.getMessage());
        }
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
    public ResponseEntity<List<Pet>> getUnassignedPets(@RequestParam("userId") Integer userId) {
        return ResponseEntity.ok(petService.getUnassignedPets(userId));
    }

    // anas bdet tekhdem hmd welyeeeyyyyy

    @GetMapping("/user/pet/{petId}/check-preferences")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<PetPreferencesResponse> checkPetPreferences(@PathVariable int petId) {
        Pet pet = petService.getPetById(petId);

        if (pet == null) {
            return ResponseEntity.notFound().build();
        }

        // Récupérer l'utilisateur connecté
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        int currentUserId = user.getId_user();

        boolean hasPreferences = pet.getPreferences() != null;
        List<Pet> matchingPets = null;

        if (hasPreferences) {
            matchingPets = petService.getPetsByStatus(PetStatus.AVAILABLE)
                    .stream()
                    .filter(p -> p.getIdPet() != petId) // Exclure le pet lui-même
                    .filter(p -> p.getUser() == null || p.getUser().getId_user() != currentUserId) // Exclure les pets de l'utilisateur connecté
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
        System.out.println("Pet: " + pet.getPetName());
        System.out.println("Breed: " + pet.getBreed() + " vs " + preferences.getPreferred_breed());
        System.out.println("Age: " + pet.getPetAge() + " vs [" + preferences.getMin_age() + ", " + preferences.getMax_age() + "]");
        System.out.println("Gender: " + pet.getGender().toString() + " vs " + preferences.getPreferred_gender());
        System.out.println("Location: " + pet.getLocation() + " vs " + preferences.getPreferred_location());
        boolean result = (preferences.getPreferred_breed() == null || pet.getBreed().equalsIgnoreCase(preferences.getPreferred_breed())) &&
                (pet.getPetAge() >= preferences.getMin_age() && pet.getPetAge() <= preferences.getMax_age()) &&
                (preferences.getPreferred_gender() == null || pet.getGender().toString().equalsIgnoreCase(preferences.getPreferred_gender())) &&
                (preferences.getPreferred_location() == null || pet.getLocation().equalsIgnoreCase(preferences.getPreferred_location()));
        System.out.println("Résultat: " + result);
        return result;
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

        // Récupérer l'utilisateur connecté
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        int currentUserId = user.getId_user();

        // Vérifier si le pet a des préférences
        if (pet.getPreferences() == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Trouver les pets correspondants aux préférences
        List<Pet> matchingPets = petService.getPetsByStatus(PetStatus.AVAILABLE)
                .stream()
                .filter(p -> p.getIdPet() != petId) // Exclure le pet lui-même
                .filter(p -> p.getUser() == null || p.getUser().getId_user() != currentUserId) // Exclure les pets de l'utilisateur connecté
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