package tn.esprit.petopia_backend.controller.vet;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth/api/meetings")
public class MeetingController {
    @PostMapping
    public ResponseEntity<Map<String, String>> createMeeting(
            @RequestParam String vetId,
            @RequestParam String clientId) {

        // Générer un ID unique pour la réunion
        String meetingId = UUID.randomUUID().toString();

        // Vous pourriez enregistrer cette réunion en base de données
        // meetingRepository.save(new Meeting(meetingId, vetId, clientId));

        Map<String, String> response = new HashMap<>();
        response.put("meetingId", meetingId);
        response.put("meetingUrl", "https://meet.jit.si/" + meetingId);

        return ResponseEntity.ok(response);
    }
}