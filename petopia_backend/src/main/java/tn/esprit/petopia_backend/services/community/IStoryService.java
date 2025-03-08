package tn.esprit.petopia_backend.services.community;

import tn.esprit.petopia_backend.entities.community.Story;

import java.util.List;

public interface IStoryService {
    Story addStory(int userId, Story story);
    List<Story> getAllStories();
    Story getStoryById(Long storyId);
    Story updateStory(Long storyId, Story story);
    void deleteStory(Long storyId);
}
