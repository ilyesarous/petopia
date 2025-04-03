import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDogBreedRecognitionRedirectButtonComponent } from './app-dog-breed-recognition-redirect-button.component';

describe('AppDogBreedRecognitionRedirectButtonComponent', () => {
  let component: AppDogBreedRecognitionRedirectButtonComponent;
  let fixture: ComponentFixture<AppDogBreedRecognitionRedirectButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppDogBreedRecognitionRedirectButtonComponent]
    });
    fixture = TestBed.createComponent(AppDogBreedRecognitionRedirectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
