import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ParticipationService } from 'src/app/services/Event/participation.service';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input() participationId?: number;
  @Input() initialTimeRemaining?: number;

  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  
  private countdownSub?: Subscription;
  private timeRemaining: number = 0;
  errorMessage: string | null = null;


  constructor(private participationService: ParticipationService) {}

  ngOnInit(): void {
    if (this.initialTimeRemaining!== undefined) {
      this.timeRemaining = this.initialTimeRemaining;
      this.startCountdown();
    } else if (this.participationId !== undefined) {
      this.loadTimeRemaining();
    } else {
      this.errorMessage = 'No valid countdown data provided';
    }
  }


  loadTimeRemaining(): void {
    if (this.participationId === undefined) {
      this.errorMessage = 'Participation ID is required';
      return;
    }

    this.participationService.getTimeRemaining(this.participationId).subscribe({
      next: (time) => {
        this.timeRemaining = time;
        this.startCountdown();
      },
      error: (err) => {
        console.error('Error loading time remaining', err);
        this.errorMessage = 'Failed to load countdown data';
      }
    });
  }

  startCountdown(): void {
    this.updateDisplay();
    
    this.countdownSub = interval(1000).subscribe(() => {
      this.timeRemaining -= 1000;
      this.updateDisplay();
      
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.updateDisplay();
        this.countdownSub?.unsubscribe();
      }
    });
  }

  updateDisplay(): void {
    this.days = Math.floor(this.timeRemaining / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((this.timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.minutes = Math.floor((this.timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((this.timeRemaining % (1000 * 60)) / 1000);
  }

  ngOnDestroy(): void {
    this.countdownSub?.unsubscribe();
  }

}
