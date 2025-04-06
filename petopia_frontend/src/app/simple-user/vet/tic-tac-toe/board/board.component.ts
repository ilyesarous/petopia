import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  
  @Input() squares: any[] = []; // Initialisation avec un tableau vide
  @Input() xIsNext: boolean = true; // Initialisation avec `true`
  @Output() play = new EventEmitter<number>();

  onClick(index: number): void {
    this.play.emit(index);
  }

}
