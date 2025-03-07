package tn.esprit.petopia_backend.services.matching;



import tn.esprit.petopia_backend.entities.matching.Preferences;

import java.util.List;
public interface IPreferencesService {
    Preferences addPreferences(Preferences preferences);
    Preferences updatePreferences(Preferences preferences);
    Preferences getPreferences(int id);
    List<Preferences> getAllPreferences();
    void deletePreferences(int id);
}
