import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRatingVetComponent } from './user-rating-vet.component';

describe('UserRatingVetComponent', () => {
  let component: UserRatingVetComponent;
  let fixture: ComponentFixture<UserRatingVetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRatingVetComponent]
    });
    fixture = TestBed.createComponent(UserRatingVetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
