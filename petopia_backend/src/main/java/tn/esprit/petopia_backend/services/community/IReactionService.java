package tn.esprit.petopia_backend.services.community;

import tn.esprit.petopia_backend.entities.community.Reaction;
import tn.esprit.petopia_backend.entities.community.ReactionType;


import java.util.List;

public interface IReactionService {
    Reaction addReaction(int userId, Long postId, ReactionType type);
    Reaction updateReaction(Long reactionId, ReactionType type);
    void removeReaction(Long reactionId);
    List<Reaction> getReactionsByPost(Long postId);
    List<Reaction> getAllReactions();
}
