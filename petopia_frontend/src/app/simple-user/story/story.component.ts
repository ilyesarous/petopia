import { Component, Input } from '@angular/core';
import { Story } from '../../models/community/story';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent {
  @Input() story!: Story;
}
