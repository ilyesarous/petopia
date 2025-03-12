package tn.esprit.petopia_backend.controller.community;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.petopia_backend.entities.community.Story;
import tn.esprit.petopia_backend.services.community.IStoryService;


import java.util.List;

@RestController
@RequestMapping("/stories")
public class StoryController {

    private final IStoryService storyService;

    public StoryController(IStoryService storyService) {
        this.storyService = storyService;
    }

    @PostMapping("/add/{userId}")
    public ResponseEntity<Story> addStory(@PathVariable int userId, @RequestBody Story story) {
        return ResponseEntity.ok(storyService.addStory(userId, story));
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
