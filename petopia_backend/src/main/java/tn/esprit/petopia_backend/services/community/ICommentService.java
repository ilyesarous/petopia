package tn.esprit.petopia_backend.services.community;

import tn.esprit.petopia_backend.entities.community.Comment;

import java.util.List;

public interface ICommentService {
    Comment addComment(int userId, Long postId, String content);
    Comment updateComment(Long commentId, String content);
    void deleteComment(Long commentId);
    Comment getCommentById(Long commentId);
    List<Comment> getAllComments();
}
