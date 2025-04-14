package tn.esprit.petopia_backend.services.vet;

import tn.esprit.petopia_backend.entities.vet.VetLocation;

import java.util.List;

public interface VetLocationService {
    VetLocation saveLocation(VetLocation location);
    List<VetLocation> getLocationsByVet(Integer vetId);
    List<VetLocation> getAllLocations();
    void deleteLocation(Long id);
}
