package tn.esprit.petopia_backend.services.community;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class TranslationService {
    private final GeminiService geminiService;

    public TranslationService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String translate(String text, String targetLang) {
        return geminiService.translateWithGemini(text, targetLang);
    }
}
