package tn.esprit.petopia_backend.services.community;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.community.Post;
import tn.esprit.petopia_backend.entities.community.PostType;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.community.PostRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements IPostService {

    @Autowired
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    public Post createPost(Post post, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        post.setUser(user);
        post.setDate(LocalDateTime.now());

        return postRepository.save(post);
    }


    @Override
    public Post getPostById(Long id) {
        return postRepository.findById(id).orElse(null);
    }

    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @Override
    public Post updatePost(Long id, Post postDetails) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.setContent(postDetails.getContent());
            post.setDate(LocalDateTime.now());
            post.setPostType(postDetails.getPostType());

            // Get the new image URL provided in postDetails.
            // If the new image string is not empty, then append it to the existing images.
            String newImage = postDetails.getImage();
            if (newImage != null && !newImage.trim().isEmpty()) {
                // If the post already has images, append the new image separated by a comma.
                String currentImages = post.getImage();
                if (currentImages != null && !currentImages.trim().isEmpty()) {
                    post.setImage(currentImages + "," + newImage);
                } else {
                    post.setImage(newImage);
                }
            }
            // (If you later decide to support removal via an extra parameter, you could check for that flag here.)

            return postRepository.save(post);
        }
        return null;
    }


    @Override
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    @Override
    public List<Post> getPostsByType(PostType postType) {
        return postRepository.findByPostType(postType); // Fetches posts by the given PostType
    }
}
