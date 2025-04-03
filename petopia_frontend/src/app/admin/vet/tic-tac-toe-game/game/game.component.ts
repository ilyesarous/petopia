import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {

  
  squares: any[] = [];
  xIsNext: boolean = true;
  winner: string | null = null;
  //humanPlayer: string = 'X'; // Joueur humain
  //computerPlayer: string = 'O'; // Ordinateur
  humanPlayer: string = '🐶'; // Emoji de chien pour le joueur humain
  computerPlayer: string = '🐱'; // Emoji de chat pour l'ordinateur
  errorProbability: number = 0.1; // 10% de chance que l'ordinateur fasse une erreur

  constructor() {
    this.newGame();
  }

  newGame(): void {
    this.squares = Array(9).fill(null);
    this.winner = null;
    this.xIsNext = true;
  }

  get player(): string {
    return this.xIsNext ? this.humanPlayer : this.computerPlayer;
  }

  makeMove(index: number): void {
    if (!this.squares[index] && !this.winner) {
      this.squares.splice(index, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }
    this.winner = this.calculateWinner();
    if (!this.winner && !this.squares.includes(null)) {
      this.winner = 'none';
    }
    if (!this.winner && !this.xIsNext) {
      this.computerMove();
    }
  }

  computerMove(): void {
    // Avec une probabilité de `errorProbability`, l'ordinateur fait un mouvement aléatoire
    if (Math.random() < this.errorProbability) {
      this.makeRandomMove();
    } else {
      this.makeBestMove();
    }
  }

  makeRandomMove(): void {
    const available = this.squares
      .map((square, index) => square === null ? index : null)
      .filter(index => index !== null) as number[];
    if (available.length > 0) {
      const randomIndex = available[Math.floor(Math.random() * available.length)];
      this.makeMove(randomIndex);
    }
  }

  makeBestMove(): void {
    let bestScore = -Infinity;
    let bestMove: number | null = null;

    for (let i = 0; i < this.squares.length; i++) {
      if (this.squares[i] === null) {
        this.squares[i] = this.computerPlayer;
        const score = this.minimax(this.squares, 0, false);
        this.squares[i] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    if (bestMove !== null) {
      this.makeMove(bestMove);
    }
  }

  minimax(board: any[], depth: number, isMaximizing: boolean): number {
    const winner = this.calculateWinner();
    if (winner === this.computerPlayer) {
      return 10 - depth;
    } else if (winner === this.humanPlayer) {
      return depth - 10;
    } else if (!board.includes(null)) {
      return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = this.computerPlayer;
          const score = this.minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = this.humanPlayer;
          const score = this.minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  calculateWinner(): string | null {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (const line of lines) {
      const [a, b, c] = line;
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        return this.squares[a];
      }
    }
    return null;
  }
  
}
