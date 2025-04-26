import { Component } from '@angular/core';
import { AdsService } from 'src/app/services/store/ads/ads.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  slides: any[] = [];

  currentSlide = 0;
  constructor(private adService: AdsService){}

  // Add to your component
startAutoRotation() {
  setInterval(() => {
    this.next();
  }, 3000);
}

// Call in ngOnInit()
ngOnInit() {
  this.adService.getAllAdsUser().subscribe(
    res => this.slides = res
  )
  this.startAutoRotation();
}

  next() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prev() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }
}
