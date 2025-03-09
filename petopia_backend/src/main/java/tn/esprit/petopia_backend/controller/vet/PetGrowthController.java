package tn.esprit.petopia_backend.controller.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.vet.Pet_Growth;
import tn.esprit.petopia_backend.services.vet.IPetGrowthService;

import java.util.List;

@RestController
//@RequestMapping("/PetGrowth")
public class PetGrowthController {

    @Autowired
    IPetGrowthService petGrowthService;

    @PostMapping("/vet/PetGrowth/addPetGrowth")
    public Pet_Growth addPetGrowth(@RequestBody Pet_Growth petGrowth) {
        return petGrowthService.addPetGrowth(petGrowth);
    }

    @PutMapping("/vet/PetGrowth/updatePetGrowth")
    public Pet_Growth updatePetGrowth(@RequestBody Pet_Growth petGrowth) {
        return petGrowthService.updatePetGrowth(petGrowth);
    }

    @DeleteMapping("/vet/PetGrowth/deletePetGrowth/{idPet_Growth}")
    public void deletePetGrowth(@PathVariable int idPet_Growth) {
        petGrowthService.deletePetGrowth(idPet_Growth);
    }

    @GetMapping("/auth/PetGrowth/retrieveAllPetGrowths")
    public List<Pet_Growth> retrieveAllPetGrowths() {
        return petGrowthService.retrieveAllPetGrowths();
    }

    @GetMapping("/auth/PetGrowth/retrievePetGrowth/{idPet_Growth}")
    public Pet_Growth retrievePetGrowth(@PathVariable int idPet_Growth) {
        return petGrowthService.retrievePetGrowth(idPet_Growth);
    }
}
