package tn.esprit.petopia_backend.controller.community;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.services.community.GeminiService;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "http://angular-service:4200")
public class GeminiController {

    private final GeminiService geminiService;

    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generate(@RequestBody String prompt) {
        String result = geminiService.generatePost(prompt);
        return ResponseEntity.ok(result);
    }
}
