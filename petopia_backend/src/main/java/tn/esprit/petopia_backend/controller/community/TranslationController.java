package tn.esprit.petopia_backend.controller.community;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import tn.esprit.petopia_backend.services.community.TranslationService;

import java.util.Map;

@RestController
@RequestMapping("/translate")
@RequiredArgsConstructor
public class TranslationController {

    private final TranslationService translationService;

    @GetMapping
    public ResponseEntity<String> translate(
            @RequestParam String text,
            @RequestParam(defaultValue = "en") String target
    ) {
        String translated = translationService.translate(text, target);
        return ResponseEntity.ok(translated);
    }
}
