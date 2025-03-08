package tn.esprit.petopia_backend.services.community;

import org.springframework.stereotype.Service;
import tn.esprit.petopia_backend.entities.community.Post;
import tn.esprit.petopia_backend.entities.community.Reaction;
import tn.esprit.petopia_backend.entities.community.ReactionType;
import tn.esprit.petopia_backend.entities.user.User;
import tn.esprit.petopia_backend.repositories.community.PostRepository;
import tn.esprit.petopia_backend.repositories.community.ReactionRepository;
import tn.esprit.petopia_backend.repositories.user.UserRepository;
import tn.esprit.petopia_backend.services.community.IReactionService;

import java.util.List;

@Service
public class ReactionServiceImpl implements IReactionService {

    private final ReactionRepository reactionRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public ReactionServiceImpl(ReactionRepository reactionRepository, UserRepository userRepository, PostRepository postRepository) {
        this.reactionRepository = reactionRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    @Override
    public Reaction addReaction(int userId, Long postId, ReactionType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Reaction reaction = new Reaction();
        reaction.setUser(user);
        reaction.setPost(post);
        reaction.setType(type);

        return reactionRepository.save(reaction);
    }

    @Override
    public Reaction updateReaction(Long reactionId, ReactionType type) {
        Reaction reaction = reactionRepository.findById(reactionId)
                .orElseThrow(() -> new RuntimeException("Reaction not found"));
        reaction.setType(type);
        return reactionRepository.save(reaction);
    }


    @Override
    public void removeReaction(Long reactionId) {
        Reaction reaction = reactionRepository.findById(reactionId)
                .orElseThrow(() -> new RuntimeException("Reaction not found"));
        reactionRepository.delete(reaction);
    }

    @Override
    public List<Reaction> getReactionsByPost(Long postId) {
        return reactionRepository.findByPostId(postId);
    }


    @Override
    public List<Reaction> getAllReactions() {
        return reactionRepository.findAll();
    }
}
