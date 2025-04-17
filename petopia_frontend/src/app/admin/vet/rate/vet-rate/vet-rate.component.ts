import { Component, OnInit } from '@angular/core';
import { VetRatingService } from 'src/app/services/vet/rating/vet-rating.service';
import { RatingVet } from 'src/app/models/vet/rating-vet';

@Component({
  selector: 'app-vet-rate',
  templateUrl: './vet-rate.component.html',
  styleUrls: ['./vet-rate.component.css']
})
export class VetRateComponent implements OnInit {

    ratings: RatingVet[] = [];
    uniqueVets: string[] = [];
  
    selectedVet: string = '';
    filteredRatings: RatingVet[] = [];

    topRatedVet: {name: string, average: number, count: number, id: number} | null = null;
    worstRatedVet: {name: string, average: number, count: number, id: number} | null = null;

     constructor(
        private vetRatingService: VetRatingService
      ) { }

      ngOnInit(): void {
        this.loadAllRatings();
      }

      loadAllRatings(): void {
        this.vetRatingService.getAllRatings().subscribe({
          next: (ratings) => {
            this.ratings = ratings;
            this.filteredRatings = [...ratings];
            this.extractUniqueVets();
            this.calculateVetStats(ratings); // Remplacez calculateTopRatedVet par calculateVetStats
          },
          error: (err) => {
            console.error('Failed to load ratings:', err);
          }
        });
      }
    
      private extractUniqueVets(): void {
        const allVetNames = this.ratings.map(r => r.uservetR.name || 'Unknown Veterinarian');
        this.uniqueVets = [...new Set(allVetNames)].sort();
      }
    
      filterRatings(): void {
        if (!this.selectedVet) {
          this.filteredRatings = [...this.ratings];
        } else {
          this.filteredRatings = this.ratings.filter(rating => 
            (rating.uservetR.name || 'Unknown Veterinarian') === this.selectedVet
          );
        }
      }
    
      private calculateVetStats(ratings: RatingVet[]): void {
        const vetStats: {[key: string]: {total: number, count: number, id: number}} = {};
      
        ratings.forEach(rating => {
          const vetName = rating.uservetR.name || 'Unknown Veterinarian';
          const vetId = rating.uservetR.id_user;
          
          if (!vetStats[vetName]) {
            vetStats[vetName] = {total: 0, count: 0, id: vetId};
          }
          vetStats[vetName].total += rating.note;
          vetStats[vetName].count++;
        });
    
        let topVet: {name: string, average: number, count: number, id: number} | null = null;
        let worstVet: {name: string, average: number, count: number, id: number} | null = null;
        let highestAvg = 0;
        let lowestAvg = 5;
    
        for (const [name, stats] of Object.entries(vetStats)) {
          const average = stats.total / stats.count;
          
          // Trouver le meilleur vétérinaire
          if (topVet === null || average > highestAvg || 
              (average === highestAvg && stats.count > topVet.count)) {
            highestAvg = average;
            topVet = {
              name,
              id: stats.id,
              average: parseFloat(average.toFixed(2)),
              count: stats.count
            };
          }
          
          // Trouver le pire vétérinaire
          if (worstVet === null || average < lowestAvg || 
              (average === lowestAvg && stats.count > worstVet.count)) {
            lowestAvg = average;
            worstVet = {
              name,
              id: stats.id,
              average: parseFloat(average.toFixed(2)),
              count: stats.count
            };
          }
        }
    
        // Ne pas afficher le worst vet si c'est le même que le top vet
        if (topVet && worstVet && topVet.id === worstVet.id) {
          this.topRatedVet = topVet;
          this.worstRatedVet = null;
        } else {
          this.topRatedVet = topVet;
          this.worstRatedVet = worstVet;
        }
    }

}