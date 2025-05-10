import { Component } from '@angular/core';

@Component({
  selector: 'app-app-dog-breed-recognition-redirect-button',
  templateUrl: './app-dog-breed-recognition-redirect-button.component.html',
  styleUrls: ['./app-dog-breed-recognition-redirect-button.component.css']
})
export class AppDogBreedRecognitionRedirectButtonComponent {

  redirectToUrl() {
    window.location.href = 'http://spring-service:8501';
  }

}
