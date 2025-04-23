package tn.esprit.petopia_backend.controller.vet;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.repositories.pet.PetRepository;
import tn.esprit.petopia_backend.services.vet.ArduinoService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth/api/arduino")
@Slf4j
public class ArduinoController {

    @Autowired
    private ArduinoService arduinoService;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @GetMapping("/process-code/{code}")
    public ResponseEntity<Map<String, Object>> processCode(@PathVariable String code) {
        log.info("\n=== Nouvelle requête reçue pour le code: {} ===", code);
        Map<String, Object> response = new HashMap<>();

        log.debug("PetRepository est null? {}", petRepository == null);

        try {
            // Journalisation détaillée
            log.debug("Conversion du code en nombre...");
            int petRef = Integer.parseInt(code);

            log.debug("Recherche de l'animal avec petRefVet = {}", petRef);
            Optional<Pet> petOpt = petRepository.findByPetRefVet(petRef);

            if (petOpt.isPresent()) {
                Pet pet = petOpt.get();
                log.info("Animal trouvé: {} (ID: {})", pet.getPetName(), pet.getIdPet());

                // Envoi à Arduino
                String arduinoMessage = "WELCOME:" + pet.getPetName();
                arduinoService.sendToArduino(arduinoMessage);
                log.debug("Message envoyé à Arduino: {}", arduinoMessage);

                // Notification WebSocket
                Map<String, Object> wsMessage = new HashMap<>();
                wsMessage.put("type", "PET_CODE_ENTERED");
                wsMessage.put("petId", pet.getIdPet());
                messagingTemplate.convertAndSend("/topic/pet-code", wsMessage);
                log.debug("Notification WebSocket envoyée");

                // Réponse API
                response.put("status", "success");
                response.put("petId", pet.getIdPet());
                response.put("petName", pet.getPetName());
                response.put("redirectUrl", "/vet/pet-growth/" + pet.getIdPet());
                return ResponseEntity.ok(response);
            } else {
                log.warn("Code animal introuvable: {}", code);
                arduinoService.sendToArduino("INVALID");
                response.put("status", "error");
                response.put("message", "Code animal introuvable");
                return ResponseEntity.status(404).body(response);
            }
        } catch (NumberFormatException e) {
            log.error("Erreur de format pour le code: {}", code, e);
            response.put("status", "error");
            response.put("message", "Code invalide - doit être numérique");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            log.error("Erreur inattendue lors du traitement du code", e);
            response.put("status", "error");
            response.put("message", "Erreur serveur");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/test-connection")
    public ResponseEntity<String> testConnection() {
        log.info("Test de connexion série demandé");
        return ResponseEntity.ok(arduinoService.getSerialPortInfo());
    }

    @GetMapping("/send-test/{message}")
    public ResponseEntity<String> sendTestMessage(@PathVariable String message) {
        log.info("Envoi d'un message test à Arduino: {}", message);
        arduinoService.sendToArduino(message);
        return ResponseEntity.ok("Message envoyé: " + message);
    }
}