import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoRatingVetComponent } from './info-rating-vet.component';

describe('InfoRatingVetComponent', () => {
  let component: InfoRatingVetComponent;
  let fixture: ComponentFixture<InfoRatingVetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoRatingVetComponent]
    });
    fixture = TestBed.createComponent(InfoRatingVetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
