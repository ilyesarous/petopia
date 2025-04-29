import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-xp-bar',
  templateUrl: './xp-bar.component.html',
  styleUrls: ['./xp-bar.component.css']
})
export class XpBarComponent {
  @Input() currentXp!: number;
  @Input() level!: number;
  
  
}
