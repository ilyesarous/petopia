package tn.esprit.petopia_backend.controller.vet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.vet.VetLocation;
import tn.esprit.petopia_backend.services.vet.VetLocationService;

import java.util.List;

@RestController
public class VetLocationController {
    //private final VetLocationService vetLocationService;
    @Autowired
    VetLocationService vetLocationService;

    @PostMapping("/auth/api/vet-locations/save")
    public VetLocation saveLocation(@RequestBody VetLocation location) {
        return vetLocationService.saveLocation(location);
    }

    @GetMapping("/auth/api/vet-locations/vet/{vetId}")
    public List<VetLocation> getLocationsByVet(@PathVariable Integer vetId) {
        return vetLocationService.getLocationsByVet(vetId);
    }

    @GetMapping("/auth/api/vet-locations/getAllLocation")
    public List<VetLocation> getAllLocations() {
        return vetLocationService.getAllLocations();
    }

    @DeleteMapping("/auth/api/vet-locations/delete/{id}")
    public void deleteLocation(@PathVariable Long id) {
        vetLocationService.deleteLocation(id);
    }
}
