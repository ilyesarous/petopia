import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../models/community/comment';
import { CommentService } from '../../services/community/comment.service';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() postId!: number;
  comments: Comment[] = [];
  newComment: string = '';

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getCommentsByPost(this.postId).subscribe(data => {
      this.comments = data;
    });
  }

  addComment(): void {
    if (!this.newComment.trim()) return;
    // Vous pouvez récupérer l'ID utilisateur via un service d'authentification; ici on utilise une valeur fictive.
    const userId = 1;
    this.commentService.addComment(userId, this.postId, this.newComment).subscribe(comment => {
      this.comments.push(comment);
      this.newComment = '';
    });
  }
}

