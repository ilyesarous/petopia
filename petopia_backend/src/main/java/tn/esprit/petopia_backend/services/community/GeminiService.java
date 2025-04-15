package tn.esprit.petopia_backend.services.community;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final List<String> animalKeywordsFr = List.of(
            "chat", "chien", "refuge", "adoption", "vétérinaire", "soin", "animaux", "croquettes", "animalerie"
    );

    private static final List<String> animalKeywordsEn = List.of(
            "cat", "dog", "pet", "shelter", "adoption", "veterinary", "vet", "animal", "puppy", "kitten"
    );

    private String cleanPrompt(String prompt) {
        return prompt.toLowerCase().replaceAll("[^\\p{L}\\s]", "");
    }



    private boolean isFrench(String prompt) {
        String cleaned = cleanPrompt(prompt);
        return animalKeywordsFr.stream().anyMatch(cleaned::contains);
    }
    private boolean isRelevantPrompt(String prompt) {
        String cleaned = cleanPrompt(prompt);
        return animalKeywordsFr.stream().anyMatch(cleaned::contains)
                || animalKeywordsEn.stream().anyMatch(cleaned::contains);
    }



    public String generatePost(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        if (!isRelevantPrompt(prompt)) {
            return isFrench(prompt)
                    ? "❌ Ce sujet n'est pas lié aux animaux ou aux soins vétérinaires."
                    : "❌ This topic is not related to pets, animals, or veterinary care.";
        }

        Map<String, Object> part = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", new Object[]{part});
        Map<String, Object> requestBody = Map.of("contents", new Object[]{content});

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                return "No candidates returned from Gemini.";
            }

            Map<String, Object> contentMap = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, String>> parts = (List<Map<String, String>>) contentMap.get("parts");

            if (parts == null || parts.isEmpty()) {
                return "No content parts in Gemini response.";
            }

            return parts.get(0).get("text");

        } catch (Exception e) {
            e.printStackTrace();
            return "Error parsing Gemini response.";
        }
    }

    public String translateWithGemini(String text, String targetLang) {
        String prompt = "Translate the following text to " + targetLang + ":\n\n" + text + "\n\nProvide only the translated sentence.";

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        Map<String, Object> part = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", new Object[]{part});
        Map<String, Object> requestBody = Map.of("contents", new Object[]{content});

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.POST, request, Map.class
            );

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
            if (candidates == null || candidates.isEmpty()) return "No translation found.";

            Map<String, Object> contentMap = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, String>> parts = (List<Map<String, String>>) contentMap.get("parts");
            if (parts == null || parts.isEmpty()) return "Empty translation.";

            return parts.get(0).get("text");
        } catch (Exception e) {
            e.printStackTrace();
            return "Translation failed.";
        }
    }


}
