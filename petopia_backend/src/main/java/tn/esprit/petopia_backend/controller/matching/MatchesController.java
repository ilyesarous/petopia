package tn.esprit.petopia_backend.controller.matching;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.matching.ChatMessage;
import tn.esprit.petopia_backend.entities.matching.MatchStatus;
import tn.esprit.petopia_backend.entities.matching.Matches;
import tn.esprit.petopia_backend.entities.pet.Pet;
import tn.esprit.petopia_backend.entities.pet.PetStatus;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.services.matching.MatchesService;
import tn.esprit.petopia_backend.services.matching.MessagingService;
import tn.esprit.petopia_backend.services.pet.PetService;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/user/matches")
public class MatchesController {
    @Autowired
    private MatchesService matchesService;

    @Autowired // Ajouté ici pour que Spring injecte PetService
    private PetService petService;

    @Autowired
    private MessagingService messagingService;

    @DeleteMapping("/deleteMatches/{idMatches}")
    @PreAuthorize("hasAuthority('ROLE_USER')")

    void deleteChambre(@PathVariable int idMatches){
        matchesService.deleteMatches(idMatches);
    }


    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    List<Matches> getAll(){
        return matchesService.getAllMatches();
    }


    @GetMapping("/getByid/{idMatches}")
    Matches getById(@PathVariable int idMatches){
        return   matchesService.getMatches(idMatches) ;
    }


    @PostConstruct
    public void init() {
        System.out.println("MatchesController initialisé - petService: " + (petService != null ? "non null" : "null"));
        System.out.println("MatchesController initialisé - matchesService: " + (matchesService != null ? "non null" : "null"));
        System.out.println("MatchesController initialisé - messagingService: " + (messagingService != null ? "non null" : "null"));
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Matches> createMatch(
            @RequestBody MatchRequest matchRequest,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        System.out.println("Utilisateur connecté ID: " + user.getId_user());

        if (petService == null) {
            System.out.println("petService est null avant utilisation");
            throw new IllegalStateException("petService n'a pas été injecté");
        }

        Pet pet1 = petService.getPetById(matchRequest.getPet1Id());
        Pet pet2 = petService.getPetById(matchRequest.getPet2Id());

        if (pet1 == null || pet2 == null) {
            System.out.println("Pet1 ou Pet2 introuvable");
            return ResponseEntity.notFound().build();
        }
        if (!pet1.getUser().getId_user().equals(user.getId_user())) {
            System.out.println("403: Pet1 n'appartient pas à l'utilisateur");
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
        System.out.println("Récupération des matchs en attente pour l'utilisateur ID: " + user.getId_user());

        // Récupérer les pets de l'utilisateur connecté
        List<Pet> userPets = petService.getPetsByOwnerId(user.getId_user());
        if (userPets.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Récupérer les matchs où pet_2 appartient à l'utilisateur et statut = PENDING
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
        System.out.println("Tentative d'acceptation du match ID: " + idMatch + " par l'utilisateur ID: " + user.getId_user());

        Matches match = matchesService.getMatches(idMatch);
        if (match == null) {
            return ResponseEntity.notFound().build();
        }

        // Vérifier que l'utilisateur est le propriétaire de pet_2
        if (!match.getPet_2().getUser().getId_user().equals(user.getId_user())) {
            System.out.println("403: L'utilisateur n'est pas autorisé à accepter ce match");
            return ResponseEntity.status(403).build();
        }

        // Vérifier que le match est en attente
        if (match.getStatus() != MatchStatus.PENDING) {
            return ResponseEntity.badRequest().body(null);
        }

        // Mettre à jour le statut à ACCEPTED
        match.setStatus(MatchStatus.ACCEPTED);
        Matches updatedMatch = matchesService.updateMatches(match);

        // Initialiser la discussion
        ChatMessage welcomeMessage = new ChatMessage();
        welcomeMessage.setMatchId(idMatch);
        welcomeMessage.setSenderId(user.getId_user()); // Utilisateur qui accepte
        welcomeMessage.setReceiverId(match.getPet_1().getUser().getId_user()); // Propriétaire de pet_1
        welcomeMessage.setContent("Salut ! Le match a été accepté, discutons !");

        messagingService.sendMessage(welcomeMessage);
        return ResponseEntity.ok(updatedMatch);
    }}


