package tn.esprit.petopia_backend.services.reclamation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tn.esprit.petopia_backend.dto.ReclamationDTO;
import tn.esprit.petopia_backend.entities.reclamation.Reclamation;
import tn.esprit.petopia_backend.repositories.reclamation.ReclamationRepository;

import java.util.Collections;
import java.util.List;
import java.util.Map;
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


    public List<ReclamationDTO> getReclamationsByUserId(Integer userId) {
        List<Reclamation> reclamations = reclamationRepository.findByUserId(userId);
        return reclamations.stream()
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
    public void deleteReclamation(int id) {
        reclamationRepository.deleteById(id);
    }

    public int updateReclamationDescription(Integer reclamationId, Integer userId, String description) {
        return reclamationRepository.updateDescriptionByReclamationIdAndUserId(reclamationId, userId, description);
    }

    public Map<String, Integer> getStatsFromPython() {
        RestTemplate restTemplate = new RestTemplate();
        String pythonUrl = "http://angular-service:5000/reclamations/stats";
        ResponseEntity<Map> response = restTemplate.getForEntity(pythonUrl, Map.class);
        return response.getBody();
    }

    public ReclamationDTO getReclamationById(int reclamationId) {
        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new RuntimeException("Reclamation not found with id: " + reclamationId));

        return convertToDTO(reclamation);
    }
    public void updateReclamationStatus(int reclamationId, String newStatus) {
        Reclamation reclamation = reclamationRepository.findById(reclamationId)
                .orElseThrow(() -> new RuntimeException("Reclamation not found with id: " + reclamationId));

        reclamation.setStatusReclamation(newStatus);
        reclamationRepository.save(reclamation);
    }

}
