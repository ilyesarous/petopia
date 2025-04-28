package tn.esprit.petopia_backend.controller.event;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.petopia_backend.services.event.OpenAIService;

import java.util.Map;

@RestController
@RequestMapping("/api/openai")
public class OpenAIController {
    private final OpenAIService openAIService;

    public OpenAIController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping("/suggest-event")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<String> suggestEvent(@RequestBody Map<String, String> request) {
        String petDescription = request.get("petDescription");
        String suggestion = openAIService.getEventSuggestion(petDescription);
        return ResponseEntity.ok(suggestion);
    }
    // Add to your OpenAIController.java
    @PostMapping("/generate-ad")
    public ResponseEntity<String> generatePetAd(@RequestBody Map<String, String> request) {
        String serviceRequest = request.get("serviceRequest");
        String adText = openAIService.generatePetAd(serviceRequest);
        return ResponseEntity.ok(adText);
    }

    @PostMapping("/generate-event-image")
    public ResponseEntity<String> generateEventImage(@RequestBody Map<String, String> request) {
        try {
            String imageUrl = openAIService.generateEventImage(request.get("eventDescription"));
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating image: " + e.getMessage());
        }
    }
}
