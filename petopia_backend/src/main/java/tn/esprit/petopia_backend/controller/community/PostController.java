package tn.esprit.petopia_backend.controller.community;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final IPostService postService;
    private final CloudinaryService cloudinaryService;

    @PostMapping("/add")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_VET', 'ROLE_PARTNER', 'ROLE_SHELTER')")
    public ResponseEntity<Post> createPost(
            @RequestParam(value = "files", required = false) MultipartFile[] files,
            @RequestParam("content") String content,
            @RequestParam("postType") String postTypeStr) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Integer userId = user.getId_user();

        try {
            String normalizedType = postTypeStr.trim().toUpperCase().replace(" ", "_");
            PostType postType = PostType.valueOf(normalizedType);
            // Loop through all files and collect their URLs in a comma-separated string.
            StringBuilder imageUrls = new StringBuilder();
            if (files != null && files.length > 0) {
                for (MultipartFile file : files) {
                    String uploadedUrl = cloudinaryService.uploadImage(file);
                    imageUrls.append(uploadedUrl).append(",");
                }
                // Remove trailing comma if present.
                if (imageUrls.length() > 0) {
                    imageUrls.setLength(imageUrls.length() - 1);
                }
            }

            Post post = new Post();
            post.setContent(content);
            // Save all image URLs in the "image" attribute (comma-separated)
            post.setImage(imageUrls.toString());
            post.setDate(LocalDateTime.now());

            // Convert the provided postType string to uppercase and then to enum.
            String typeStr = postTypeStr.trim().toUpperCase();
            post.setPostType(postType);

            Post savedPost = postService.createPost(post, userId);
            return ResponseEntity.ok(savedPost);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IllegalArgumentException iae) {
            // This exception occurs if postTypeStr doesn't match any enum constant.
            iae.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }





    // Other endpoints remain unchanged...
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
    public ResponseEntity<Post> updatePost(
            @PathVariable Long id,
            @RequestParam("content") String content,
            @RequestParam("postType") String postTypeStr,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "removeImage", required = false) boolean removeImage
    ) throws IOException {
        Post existingPost = postService.getPostById(id);
        existingPost.setContent(content);
        existingPost.setPostType(PostType.valueOf(postTypeStr));
        existingPost.setDate(LocalDateTime.now());

        if (removeImage) {
            existingPost.setImage(null);
        }

        if (file != null && !file.isEmpty()) {
            String uploadedUrl = cloudinaryService.uploadImage(file);
            String currentImages = existingPost.getImage();

            if (currentImages != null && !currentImages.trim().isEmpty()) {
                existingPost.setImage(currentImages + "," + uploadedUrl);
            } else {
                existingPost.setImage(uploadedUrl);
            }
        }

        Post updated = postService.updatePost(id,existingPost);
        return ResponseEntity.ok(updated);
    }








    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok("Post supprimé avec succès !");
    }
}
