package tn.esprit.petopia_backend.controller.reclamation;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.dto.ReclamationDTO;
import tn.esprit.petopia_backend.dto.ReqRes;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.reclamation.Reclamation;
import tn.esprit.petopia_backend.services.reclamation.ReclamationService;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ReclamationController {
    private final ReclamationService reclamationService;

    public ReclamationController(ReclamationService reclamationService) {
        this.reclamationService = reclamationService;
    }

    @PostMapping("/reclamation/add")
    @PreAuthorize("hasAnyAuthority('ROLE_USER')")

    public ResponseEntity<?> addReclamation(@RequestBody Reclamation reclamation) {
        try {
            Reclamation savedReclamation = reclamationService.addReclamation(reclamation);
            return ResponseEntity.ok(Collections.singletonMap("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }
    @GetMapping("/reclamation/reclamations")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
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

    @GetMapping("/reclamation/get/{userId}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<ReclamationDTO>> getReclamationsByUserId(@PathVariable Integer userId) {
        List<ReclamationDTO> reclamations = reclamationService.getReclamationsByUserId(userId);
        if (reclamations.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reclamations);
    }

    @DeleteMapping("/reclamation/delete/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteReclamation(@PathVariable int id) {
        try {
            reclamationService.deleteReclamation(id);
            return ResponseEntity.ok(Collections.singletonMap("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PutMapping("/reclamation/update-description/{userId}/{reclamationId}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<?> updateReclamationDescription(
            @PathVariable Integer userId,
            @PathVariable Integer reclamationId,
            @RequestBody Map<String, String> request
    ) {
        String description = request.get("description");
        int updatedRows = reclamationService.updateReclamationDescription(reclamationId, userId, description);
        if (updatedRows > 0) {
            return ResponseEntity.ok(Collections.singletonMap("message", "Description updated successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "No reclamation found for this user"));
        }
    }



}
