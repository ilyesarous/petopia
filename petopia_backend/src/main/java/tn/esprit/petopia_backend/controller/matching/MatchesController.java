package tn.esprit.petopia_backend.controller.matching;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.dto.FriendWithPets;
import tn.esprit.petopia_backend.entities.user.ChatMessage;
import tn.esprit.petopia_backend.entities.matching.MatchStatus;
import tn.esprit.petopia_backend.entities.matching.Matches;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.pet.PetStatus;
import tn.esprit.petopia_backend.entities.user.MessageType;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.services.matching.MatchesService;
import tn.esprit.petopia_backend.services.matching.MessagingService;
import tn.esprit.petopia_backend.services.pet.PetService;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user/matches")
public class MatchesController {

    @Autowired
    private MatchesService matchesService;

    @Autowired
    private PetService petService;

    @Autowired
    private MessagingService messagingService;

    @DeleteMapping("/deleteMatches/{idMatches}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public void deleteMatches(@PathVariable int idMatches) {
        matchesService.deleteMatches(idMatches);
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public List<Matches> getAll() {
        return matchesService.getAllMatches();
    }

    @GetMapping("/getByid/{idMatches}")
    public Matches getById(@PathVariable int idMatches) {
        return matchesService.getMatches(idMatches);
    }

    @PostConstruct
    public void init() {
        System.out.println("MatchesController initialized - petService: " + (petService != null ? "non null" : "null"));
        System.out.println("MatchesController initialized - matchesService: " + (matchesService != null ? "non null" : "null"));
        System.out.println("MatchesController initialized - messagingService: " + (messagingService != null ? "non null" : "null"));
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Matches> createMatch(
            @RequestBody MatchRequest matchRequest,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        System.out.println("Authenticated user ID: " + user.getId_user());

        if (petService == null) {
            System.out.println("petService is null");
            throw new IllegalStateException("petService not injected");
        }

        Pet pet1 = petService.getPetById(matchRequest.getPet1Id());
        Pet pet2 = petService.getPetById(matchRequest.getPet2Id());

        if (pet1 == null || pet2 == null) {
            System.out.println("Pet1 or Pet2 not found");
            return ResponseEntity.notFound().build();
        }
        if (!pet1.getUser().getId_user().equals(user.getId_user())) {
            System.out.println("403: Pet1 does not belong to user");
            return ResponseEntity.status(403).build();
        }
        if (pet2.getStatus() != PetStatus.AVAILABLE) {
            return ResponseEntity.badRequest().body(null);
        }
        if (pet1.getIdPet() == pet2.getIdPet()) {
            return ResponseEntity.badRequest().body(null);
        }

        boolean matchExists = matchesService.getAllMatches().stream()
                .anyMatch(m -> (m.getPet_1().getIdPet() == pet1.getIdPet() && m.getPet_2().getIdPet() == pet2.getIdPet()) ||
                        (m.getPet_1().getIdPet() == pet2.getIdPet() && m.getPet_2().getIdPet() == pet1.getIdPet()));
        if (matchExists) {
            return ResponseEntity.badRequest().body(null);
        }

        Matches match = new Matches();
        match.setPet_1(pet1);
        match.setPet_2(pet2);
        match.setCompatibilite(true);
        match.setStatus(MatchStatus.PENDING);

        Matches savedMatch = matchesService.addMatches(match);
        return ResponseEntity.ok(savedMatch);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<Matches>> getPendingMatches(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        System.out.println("Fetching pending matches for user ID: " + user.getId_user());

        List<Pet> userPets = petService.getPetsByOwnerId(user.getId_user());
        if (userPets.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Matches> pendingMatches = userPets.stream()
                .flatMap(pet -> matchesService.getMatchesByPet2IdAndPending(pet.getIdPet()).stream())
                .collect(Collectors.toList());

        return ResponseEntity.ok(pendingMatches);
    }

    @PostMapping("/accept/{idMatch}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Matches> acceptMatch(
            @PathVariable int idMatch,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        System.out.println("Attempting to accept match ID: " + idMatch + " by user ID: " + user.getId_user());

        Matches match = matchesService.getMatches(idMatch);
        if (match == null) {
            return ResponseEntity.notFound().build();
        }

        if (!match.getPet_2().getUser().getId_user().equals(user.getId_user())) {
            System.out.println("403: User not authorized to accept this match");
            return ResponseEntity.status(403).build();
        }

        if (match.getStatus() != MatchStatus.PENDING) {
            return ResponseEntity.badRequest().body(null);
        }

        match.setStatus(MatchStatus.ACCEPTED);
        Matches updatedMatch = matchesService.updateMatches(match);

        // In acceptMatch method
        ChatMessage welcomeMessage = ChatMessage.builder()
                .matchId(idMatch)
                .senderId(user.getId_user())
                .receiverId(match.getPet_1().getUser().getId_user())
                .sender(user.getUsername()) // or getEmail()
                .recipient(match.getPet_1().getUser().getUsername())
                .content("Salut ! Le match a été accepté, discutons !")
                .type(MessageType.CHAT)
                .build();
        messagingService.sendMessage(welcomeMessage);
        return ResponseEntity.ok(updatedMatch);
    }


    @GetMapping("/friends")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<FriendWithPets>> getAcceptedFriends(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        System.out.println("Fetching friends for user ID: " + user.getId_user());

        List<Pet> userPets = petService.getPetsByOwnerId(user.getId_user());
        if (userPets.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Matches> acceptedMatches = matchesService.getAllMatches().stream()
                .filter(match -> match.getStatus() == MatchStatus.ACCEPTED)
                .filter(match -> userPets.contains(match.getPet_1()) || userPets.contains(match.getPet_2()))
                .collect(Collectors.toList());

        if (acceptedMatches.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        Map<User, List<Pet>> friendsWithPetsMap = acceptedMatches.stream()
                .collect(Collectors.groupingBy(
                        match -> match.getPet_1().getUser().getId_user().equals(user.getId_user())
                                ? match.getPet_2().getUser()
                                : match.getPet_1().getUser(),
                        Collectors.mapping(
                                match -> match.getPet_1().getUser().getId_user().equals(user.getId_user())
                                        ? match.getPet_2()
                                        : match.getPet_1(),
                                Collectors.toList()
                        )
                ));

        List<FriendWithPets> friends = friendsWithPetsMap.entrySet().stream()
                .map(entry -> new FriendWithPets(entry.getKey(), entry.getValue()))
                .filter(friend -> !friend.getUser().getId_user().equals(user.getId_user()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(friends);
    }

    @GetMapping("/messages/{matchId}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<ChatMessage>> getMessagesForMatch(
            @PathVariable int matchId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        Matches match = matchesService.getMatches(matchId);
        if (match == null) {
            return ResponseEntity.notFound().build();
        }
        if (!match.getPet_1().getUser().getId_user().equals(user.getId_user()) &&
                !match.getPet_2().getUser().getId_user().equals(user.getId_user())) {
            return ResponseEntity.status(403).build();
        }
        List<ChatMessage> messages = messagingService.getMessagesForMatch(matchId);
        return ResponseEntity.ok(messages);
    }
}