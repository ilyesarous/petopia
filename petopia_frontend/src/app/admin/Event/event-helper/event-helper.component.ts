import { Component, OnInit } from '@angular/core';
import { OpenAIService } from 'src/app/services/Event/open-ai.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-event-helper',
  templateUrl: './event-helper.component.html',
  styleUrls: ['./event-helper.component.css']
})
export class EventHelperComponent implements OnInit {
  petDescription: string = '';
  suggestion: string = '';
  isLoading: boolean = false;
  showHelper: boolean = false;

  constructor(private openAIService: OpenAIService) {
  }
  ngOnInit(): void {
  }

  toggleHelper(): void {
    this.showHelper = !this.showHelper;
    if (!this.showHelper) {
      this.resetHelper();
    }
  }

  getSuggestion(): void {
    if (!this.petDescription.trim()) return;
    
    this.isLoading = true;
    this.suggestion = '';
    
    (this.openAIService as any).suggestEventForPet(this.petDescription).subscribe({
      next: (response: string) => {
        this.suggestion = response;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.suggestion = 'Error getting suggestions. Please try again.';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  resetHelper(): void {
    this.petDescription = '';
    this.suggestion = '';
    this.isLoading = false;
  }
}