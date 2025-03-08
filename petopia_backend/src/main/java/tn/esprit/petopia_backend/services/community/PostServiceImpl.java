package tn.esprit.petopia_backend.services.community;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.community.Post;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.community.PostRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;


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
        // Fetch the user from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Assign the user to the post
        post.setUser(user);

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
            post.setImage(postDetails.getImage());
            post.setDate(postDetails.getDate());
            post.setPostType(postDetails.getPostType());
            return postRepository.save(post);
        }
        return null;
    }

    @Override
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
