package tn.esprit.petopia_backend.services.matching;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.matching.Preferences;
import tn.esprit.petopia_backend.repositories.matching.PreferencesRepository;

import java.util.List;

@Service
public class PreferencesService implements IPreferencesService {
    @Autowired
    private PreferencesRepository preferencesRepository;

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

    @Override
    public void deletePreferences(int id) {
        preferencesRepository.deleteById(id);

    }
}
