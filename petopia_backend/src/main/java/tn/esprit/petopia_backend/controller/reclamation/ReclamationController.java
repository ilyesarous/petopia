package tn.esprit.petopia_backend.controller.reclamation;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.dto.ReclamationDTO;
import tn.esprit.petopia_backend.dto.ReqRes;
import tn.esprit.petopia_backend.entities.reclamation.Reclamation;
import tn.esprit.petopia_backend.services.reclamation.ReclamationService;

import java.util.Collections;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ReclamationController {
    private final ReclamationService reclamationService;

    public ReclamationController(ReclamationService reclamationService) {
        this.reclamationService = reclamationService;
    }

    @PostMapping("/user/reclamation/add")
    public ResponseEntity<?> addReclamation(@RequestBody Reclamation reclamation) {
        try {
            Reclamation savedReclamation = reclamationService.addReclamation(reclamation);
            return ResponseEntity.ok(Collections.singletonMap("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    @GetMapping("/admin/reclamation/reclamations")
    public ResponseEntity<ReqRes> getAllReclamations() {
        ReqRes response = new ReqRes();
        try {
            List<ReclamationDTO> reclamations = reclamationService.getAllReclamations();
            response.setReclamations(reclamations);
            response.setStatusCode(HttpStatus.OK.value());
            response.setMessage("Reclamations fetched successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setMessage("Error fetching reclamations: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
