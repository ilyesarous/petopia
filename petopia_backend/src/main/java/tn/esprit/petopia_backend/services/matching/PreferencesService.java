package tn.esprit.petopia_backend.services.matching;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.matching.Preferences;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.repositories.matching.PreferencesRepository;
import tn.esprit.petopia_backend.repositories.pet.PetRepository;

import java.util.List;

@Service
public class PreferencesService implements IPreferencesService {
    @Autowired
    private PreferencesRepository preferencesRepository;
    @Autowired
    private PetRepository petRepository;

    @Override
    public Preferences addPreferences(Preferences preference) {
        return  preferencesRepository.save(preference) ;
    }

    @Override
    public Preferences updatePreferences(Preferences preferences) {
        return preferencesRepository.save(preferences);
    }

    @Override
    public Preferences getPreferences(int id) {
        return preferencesRepository.findById(id).get();
    }

    @Override
    public List<Preferences> getAllPreferences() {
        return preferencesRepository.findAll();
    }

   /* @Override
    public void deletePreferences(int id) {
        preferencesRepository.deleteById(id);

    }*/

    @Override
    @Transactional
    public void deletePreferences(int id) {
        Preferences preferences = preferencesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Preferences not found"));
        Pet pet = preferences.getPet();
        if (pet != null) {
            pet.setPreferences(null); // Clear the reference on the Pet side
            preferences.setPet(null); // Clear the reference on the Preferences side
            petRepository.save(pet); // Save the updated Pet (inject PetRepository)
        }
        preferencesRepository.deleteById(id);
    }
}
