import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit, OnDestroy, OnChanges {
  @Input() timeRemaining?: number;
  
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  
  private countdownSub?: Subscription;

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeRemaining'] && !changes['timeRemaining'].firstChange) {
      this.updateDisplay();
    }
  }

  startCountdown(): void {
    this.updateDisplay();
    
    this.countdownSub = interval(1000).subscribe(() => {
      if (this.timeRemaining && this.timeRemaining > 0) {
        this.timeRemaining -= 1000;
        this.updateDisplay();
      } else {
        this.timeRemaining = 0;
        this.updateDisplay();
        this.countdownSub?.unsubscribe();
      }
    });
  }

  updateDisplay(): void {
    if (!this.timeRemaining) {
      this.timeRemaining = 0;
    }
    
    const totalSeconds = Math.floor(this.timeRemaining / 1000);
    this.days = Math.floor(totalSeconds / (3600 * 24));
    this.hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    this.minutes = Math.floor((totalSeconds % 3600) / 60);
    this.seconds = Math.floor(totalSeconds % 60);
  }

  ngOnDestroy(): void {
    this.countdownSub?.unsubscribe();
  }
}