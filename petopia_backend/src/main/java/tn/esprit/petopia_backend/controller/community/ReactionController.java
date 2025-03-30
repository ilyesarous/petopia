package tn.esprit.petopia_backend.controller.community;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.community.Reaction;
import tn.esprit.petopia_backend.entities.community.ReactionType;
import tn.esprit.petopia_backend.services.community.IReactionService;

import java.util.List;

@RestController
@RequestMapping("/reactions")
public class ReactionController {

    private final IReactionService reactionService;

    public ReactionController(IReactionService reactionService) {
        this.reactionService = reactionService;
    }

    @PostMapping("/add")
    public ResponseEntity<Reaction> addReaction(@RequestParam int userId, @RequestParam Long postId, @RequestParam ReactionType type) {
        return ResponseEntity.ok(reactionService.addReaction(userId, postId, type));
    }

    @PutMapping("/update/{reactionId}")
    public ResponseEntity<Reaction> updateReaction(@PathVariable Long reactionId, @RequestParam ReactionType type) {
        return ResponseEntity.ok(reactionService.updateReaction(reactionId, type));
    }

    @DeleteMapping("/remove/{reactionId}")
    public ResponseEntity<Void> removeReaction(@PathVariable Long reactionId) {
        reactionService.removeReaction(reactionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Reaction>> getReactionsByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(reactionService.getReactionsByPost(postId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Reaction>> getAllReactions() {
        return ResponseEntity.ok(reactionService.getAllReactions());
    }
}
