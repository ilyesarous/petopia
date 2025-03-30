package tn.esprit.petopia_backend.services.reclamation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.dto.ReclamationDTO;
import tn.esprit.petopia_backend.entities.reclamation.Reclamation;
import tn.esprit.petopia_backend.repositories.reclamation.ReclamationRepository;

import java.util.List;
import java.util.stream.Collectors;

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
    public List<ReclamationDTO> getAllReclamations() {
        return reclamationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ReclamationDTO convertToDTO(Reclamation reclamation) {
        ReclamationDTO dto = new ReclamationDTO();
        dto.setIdReclamation(reclamation.getIdReclamation());
        dto.setType(reclamation.getType());
        dto.setDescription(reclamation.getDescription());
        dto.setStatusReclamation(reclamation.getStatusReclamation());
        dto.setDateReclamation(reclamation.getDateReclamation());
        dto.setUserName(reclamation.getUser().getName());
        return dto;
    }
}
