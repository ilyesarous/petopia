package tn.esprit.petopia_backend.services.community;

import tn.esprit.petopia_backend.entities.community.Post;

import java.util.List;

public interface IPostService{
    Post createPost(Post post, Integer userId);
    Post getPostById(Long id);
    List<Post> getAllPosts();
    Post updatePost(Long id, Post postDetails);
    void deletePost(Long id);

}
