package tn.esprit.petopia_backend.services.community;

import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.community.Story;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.community.StoryRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StoryServiceImpl implements IStoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;

    public StoryServiceImpl(StoryRepository storyRepository, UserRepository userRepository) {
        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Story addStory(int userId, Story story) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        story.setUser(user);
        story.setCreatedAt(LocalDateTime.now());
        story.setExpiresAt(LocalDateTime.now().plusHours(24));

        return storyRepository.save(story);
    }

    @Override
    public List<Story> getAllStories() {
        return storyRepository.findAll();
    }

    @Override
    public Story getStoryById(Long storyId) {
        return storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));
    }

    @Override
    public Story updateStory(Long storyId, Story updatedStory) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        if (updatedStory.getContent() != null) {
            story.setContent(updatedStory.getContent());
        }
        if (updatedStory.getImage() != null) {
            story.setImage(updatedStory.getImage());
        }

        return storyRepository.save(story);
    }

    @Override
    public void deleteStory(Long storyId) {
        if (!storyRepository.existsById(storyId)) {
            throw new RuntimeException("Story not found");
        }
        storyRepository.deleteById(storyId);
    }
}
