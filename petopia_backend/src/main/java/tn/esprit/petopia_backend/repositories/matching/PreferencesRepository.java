package tn.esprit.petopia_backend.repositories.matching;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.petopia_backend.entities.matching.Preferences;

@Repository
public interface PreferencesRepository extends JpaRepository <Preferences,Integer> {
}
