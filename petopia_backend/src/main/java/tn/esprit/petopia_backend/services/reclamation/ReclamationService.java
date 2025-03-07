package tn.esprit.petopia_backend.services.reclamation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.reclamation.Reclamation;
import tn.esprit.petopia_backend.repositories.reclamation.ReclamationRepository;

@Service
public class ReclamationService {
    @Autowired
    private final ReclamationRepository reclamationRepository ;

    public ReclamationService(ReclamationRepository reclamationRepository) {
        this.reclamationRepository = reclamationRepository;
    }

    public Reclamation addReclamation(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);
    }
    public Reclamation updateReclamation(Reclamation reclamation) {
        return reclamationRepository.save(reclamation);

    }
}
