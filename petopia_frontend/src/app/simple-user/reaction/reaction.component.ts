import { Component, Input } from '@angular/core';
import { Reaction, ReactionType } from '../../models/community/reaction';
import { ReactionService } from '../../services/community/reaction.service';


@Component({
  selector: 'app-reaction',
  templateUrl: './reaction.component.html',
  styleUrls: ['./reaction.component.css']
})
export class ReactionComponent {
  @Input() postId!: number;
  
  // Map reaction types to emojis
  reactionEmojiMap: { [key in ReactionType]: string } = {
    [ReactionType.LIKE]: '👍',
    [ReactionType.LOVE]: '❤️',
    [ReactionType.WOW]: '😮',
    [ReactionType.HAHA]: '😂',
    [ReactionType.SAD]: '😢'
  };

  // Generate an array of reaction types for the *ngFor loop
  reactionTypes = Object.values(ReactionType);

  constructor(private reactionService: ReactionService) {}

  addReaction(type: ReactionType): void {

    this.reactionService.addReaction(this.postId, type).subscribe();

  }
}
