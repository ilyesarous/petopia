package tn.esprit.petopia_backend.controller.community;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.community.Comment;
import tn.esprit.petopia_backend.services.community.ICommentService;
import tn.esprit.petopia_backend.services.community.PostModerationService;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final ICommentService commentService;
    private final PostModerationService postModerationService;

    public CommentController(ICommentService commentService, PostModerationService postModerationService) {
        this.commentService = commentService;
        this.postModerationService = postModerationService;
    }

    @PostMapping(value = "/add", consumes = {"multipart/form-data"})
    public ResponseEntity<?> addComment(
            @RequestParam int userId,
            @RequestParam Long postId,
            @RequestParam String content) {
        if (postModerationService.containsInappropriateContent(content)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ Your comment contains inappropriate content.");
        }

        Comment newComment = commentService.addComment(userId, postId, content);
        return ResponseEntity.ok(newComment);
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        String content = requestBody.get("content");
        if (postModerationService.containsInappropriateContent(content)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ Your comment contains inappropriate content.");
        }
        Comment updatedComment = commentService.updateComment(id, content);
        return ResponseEntity.ok(updatedComment);
    }



    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable Long id) {
        Comment comment = commentService.getCommentById(id);
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Comment>> getAllComments() {
        List<Comment> comments = commentService.getAllComments();
        return ResponseEntity.ok(comments);
    }
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPost(@PathVariable Long postId) {
        List<Comment> comments = commentService.getCommentsByPost(postId);
        return ResponseEntity.ok(comments);
    }

}
