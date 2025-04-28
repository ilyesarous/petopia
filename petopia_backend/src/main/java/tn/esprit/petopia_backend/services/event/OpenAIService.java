package tn.esprit.petopia_backend.services.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {
    @Value("${openai.api.key}")
    private String apiKey;
    private static final Logger logger = LoggerFactory.getLogger(OpenAIService.class);

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    public String getEventSuggestion(String petDescription) {
        RestTemplate restTemplate = new RestTemplate();

        // Use org.springframework.http.HttpHeaders instead of java.net.http.HttpHeaders
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        String prompt = String.format("""
            Based on this pet description: %s
            Suggest the best type of event or activity that suits this pet.
            Suggest one or two event types (e.g., social playgroups, quiet training sessions, hiking meetups, agility classes, puppy yoga).
            Also explain briefly why this event is a good fit.
            Make simple and clear point.
            """, petDescription);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4");
        requestBody.put("temperature", 0.7);
        requestBody.put("max_tokens", 300);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "user", "content", prompt));
        requestBody.put("messages", messages);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_URL, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
            return "No suggestion available";
        } catch (Exception e) {
            return "Error getting suggestion: " + e.getMessage();
        }
    }

    public String generatePetAd(String serviceRequest) {
        RestTemplate restTemplate = new RestTemplate();

        String prompt = String.format("""
        Take the following pet service request and turn it into a friendly, playful, pet-themed advertisement:
        - Make it sound exciting and heartwarming
        - Use emojis and catchy phrases
        - Keep it short and sweet (2–4 lines)
        
        Example input: "I need someone to take my dog for a walk"
        
        Example output:
        🐾 **Looking for a Pawsome Walker!**
        My energetic pup needs some outdoor fun and tail-wagging adventures. If you love walks and wagging tails, let's talk! 🐶
        
        Now transform this: "%s"
        """, serviceRequest);

        // Create request headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey); // Use your injected API key

        // Build the request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4");
        requestBody.put("temperature", 0.85);
        requestBody.put("max_tokens", 200);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "user", "content", prompt));
        requestBody.put("messages", messages);

        // Create the HTTP entity
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            // Make the API call
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    OPENAI_URL, // Your OpenAI endpoint URL
                    entity,
                    Map.class
            );

            // Process the response
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
            return "Could not generate ad at this time.";
        } catch (Exception e) {
            // Log the error for debugging
            logger.error("Error generating pet ad: " + e.getMessage(), e);
            return "Error generating advertisement. Please try again later.";
        }
    }
    public String generateEventImage(String eventDescription) throws IOException {
        RestTemplate restTemplate = new RestTemplate();

        // Create the request to OpenAI
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "dall-e-3");
        requestBody.put("prompt", eventDescription);
        requestBody.put("size", "1024x1024");
        requestBody.put("quality", "standard");
        requestBody.put("n", 1);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.openai.com/v1/images/generations",
                    entity,
                    Map.class
            );

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("data")) {
                List<Map<String, Object>> data = (List<Map<String, Object>>) responseBody.get("data");
                if (!data.isEmpty()) {
                    return (String) data.get(0).get("url");
                }
            }
            throw new RuntimeException("No image URL returned from OpenAI");
        } catch (Exception e) {
            logger.error("Error generating event image: " + e.getMessage(), e);
            throw new RuntimeException("Error generating event image", e);
        }
    }
}