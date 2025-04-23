package tn.esprit.petopia_backend.controller.community;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.entities.community.Post;
import tn.esprit.petopia_backend.entities.community.PostType;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.services.community.CloudinaryService;
import tn.esprit.petopia_backend.services.community.IPostService;
import tn.esprit.petopia_backend.services.community.PostModerationService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final IPostService postService;
    private final CloudinaryService cloudinaryService;
    private final PostModerationService postModerationService;

    @PostMapping("/add")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_VET', 'ROLE_PARTNER', 'ROLE_SHELTER')")
    public ResponseEntity<?> createPost(
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam(value = "image", required = false) String imageUrl,
            @RequestParam("content") String content,
            @RequestParam("postType") String postTypeStr) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Integer userId = user.getId_user();

        if (postModerationService.containsInappropriateContent(content)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ Your post contains inappropriate content.");
        }

        try {
            String normalizedType = postTypeStr.trim().toUpperCase().replace(" ", "_");
            PostType postType = PostType.valueOf(normalizedType);
            StringBuilder imageUrls = new StringBuilder();

            if (imageUrl != null && !imageUrl.isBlank()) {
                imageUrls.append(imageUrl);
            }

            if (files != null && files.length > 0) {
                for (MultipartFile file : files) {
                    String uploadedUrl = cloudinaryService.uploadImage(file);
                    if (imageUrls.length() > 0) imageUrls.append(",");
                    imageUrls.append(uploadedUrl);
                }
            }

            Post post = new Post();
            post.setContent(content);
            post.setImage(imageUrls.toString());
            post.setDate(LocalDateTime.now());
            post.setPostType(postType);

            Post savedPost = postService.createPost(post, userId);
            return ResponseEntity.ok(savedPost);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed.");
        } catch (IllegalArgumentException iae) {
            iae.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ Invalid post type.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Post>> getAllPosts(@RequestParam(required = false) PostType postType) {
        if (postType != null) {
            List<Post> filteredPosts = postService.getPostsByType(postType);
            return ResponseEntity.ok(filteredPosts);
        }
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @RequestParam("content") String content,
            @RequestParam("postType") String postTypeStr,
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam(value = "image", required = false) String image
    ) throws IOException {
        if (postModerationService.containsInappropriateContent(content)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("❌ Your updated post contains inappropriate content.");
        }
        Post existingPost = postService.getPostById(id);
        existingPost.setContent(content);
        existingPost.setPostType(PostType.valueOf(postTypeStr));
        existingPost.setDate(LocalDateTime.now());

        List<String> finalImages = new ArrayList<>();

        if (image != null && !image.trim().isEmpty()) {
            finalImages.addAll(Arrays.asList(image.split(",")));
        }

        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String uploadedUrl = cloudinaryService.uploadImage(file);
                    finalImages.add(uploadedUrl);
                }
            }
        }

        existingPost.setImage(String.join(",", finalImages));

        Post updated = postService.updatePost(id, existingPost);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok("Post supprimé avec succès !");
    }
}