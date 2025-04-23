package tn.esprit.petopia_backend.services.community;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class PostModerationService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    //  Custom bad words
    private static final List<String> localBadWords = List.of(
            "stupid", "aaaaa","idiot", "dumb", "bastard", "shit", "fuck", "hell", "moron"
    );


    public boolean containsInappropriateContent(String text) {
        return containsLocalBadWords(text) || containsOpenAIModerationViolation(text);
    }

    //  Check for words from localBadWords list
    private boolean containsLocalBadWords(String text) {
        String cleaned = text.toLowerCase().replaceAll("[^a-zA-Zàâçéèêëîïôûùüÿñæœ\\s]", "");
        return localBadWords.stream().anyMatch(cleaned::contains);
    }

    //  Check using OpenAI Moderation API
    private boolean containsOpenAIModerationViolation(String text) {
        String url = "https://api.openai.com/v1/moderations";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = Map.of("input", text);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.getBody().get("results");

            if (!results.isEmpty()) {
                Map<String, Boolean> categories = (Map<String, Boolean>) results.get(0).get("categories");
                return categories.containsValue(true);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }
}
