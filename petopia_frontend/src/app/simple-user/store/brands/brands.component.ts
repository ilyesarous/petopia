import { Component } from '@angular/core';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent {
  stories = [
    {
      profileImage: '../../../../assets/images/store/brands/brand1.png',
      profileName: 'YourBrand',
      seen: false
    },
    {
      profileImage: '../../../../assets/images/store/brands/brand1.png',
      profileName: 'Partner1',
      seen: true
    },
    {
      profileImage: '../../../../assets/images/store/brands/brand1.png',
      profileName: 'Partner2',
      seen: false
    },
    // Add more stories as needed
  ];

  openStory(index: number) {
    // Mark as seen when opened
    this.stories[index].seen = true;
    
    // Implement your story opening logic here
    console.log('Opening story:', index);
    // You would typically:
    // 1. Set the current story index
    // 2. Show the full-screen story component
    // 3. Start the story progression
  }

}
