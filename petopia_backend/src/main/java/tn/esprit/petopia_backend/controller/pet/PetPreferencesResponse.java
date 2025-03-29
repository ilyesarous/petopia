package tn.esprit.petopia_backend.controller.pet;

import tn.esprit.petopia_backend.entities.matching.Preferences;
import tn.esprit.petopia_backend.entities.pet.Pet;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PetPreferencesResponse {
    private int idPet;
    private String petName;
    private boolean hasPreferences;
    private Preferences preferences;
    private List<Pet> matchingPets; // On le laisse pour les étapes futures
}