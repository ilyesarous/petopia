package tn.esprit.petopia_backend.controller.pet;


import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.services.pet.PetService;

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
}