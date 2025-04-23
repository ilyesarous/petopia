package tn.esprit.petopia_backend.controller.community;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.petopia_backend.entities.community.Story;
import tn.esprit.petopia_backend.services.community.IStoryService;
import tn.esprit.petopia_backend.services.community.MediaUploadService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/stories")
public class StoryController {

    private final IStoryService storyService;
    private final MediaUploadService mediaUploadService;

    public StoryController(IStoryService storyService, MediaUploadService mediaUploadService) {
        this.storyService = storyService;
        this.mediaUploadService = mediaUploadService;
    }

    @PostMapping(value = "/add/{userId}", consumes = {"multipart/form-data"})
    public ResponseEntity<Story> addStory(@PathVariable int userId,
                                          @RequestParam("file") MultipartFile file,
                                          @RequestParam(value = "text", required = false) String text) throws IOException {
        String mediaUrl = mediaUploadService.uploadMedia(file); // Can be image or video

        Story story = new Story();
        story.setImage(mediaUrl); // You may rename this to 'media' if you're storing both
        story.setContent(text);
        story.setCreatedAt(LocalDateTime.now());
        story.setExpiresAt(LocalDateTime.now().plusHours(24));

        Story savedStory = storyService.addStory(userId, story);
        return ResponseEntity.ok(savedStory);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Story>> getAllStories() {
        return ResponseEntity.ok(storyService.getAllStories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Story> getStoryById(@PathVariable Long id) {
        return ResponseEntity.ok(storyService.getStoryById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Story> updateStory(@PathVariable Long id, @RequestBody Story story) {
        return ResponseEntity.ok(storyService.updateStory(id, story));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteStory(@PathVariable Long id) {
        storyService.deleteStory(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/test-delete")
    public void testDeleteExpiredStories() {
        storyService.deleteExpiredStories();
    }
}
