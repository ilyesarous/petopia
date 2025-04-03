import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  slides = [
    {
      image: '../../../../assets/images/store/carousel/banner1.jpg',
      title: 'Summer Collection',
      text: 'Up to 50% off selected items'
    },
    {
      image: '../../../../assets/images/store/carousel/banner3.png',
      title: 'New Arrivals', 
      text: 'Discover our latest products'
    },
    {
      image: '../../../../assets/images/store/carousel/banner4.png',
      title: 'New Arrivals', 
      text: 'Discover our latest products'
    },
  ];

  currentSlide = 0;

  // Add to your component
startAutoRotation() {
  setInterval(() => {
    this.next();
  }, 5000);
}

// Call in ngOnInit()
ngOnInit() {
  this.startAutoRotation();
}

  next() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prev() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }
}
