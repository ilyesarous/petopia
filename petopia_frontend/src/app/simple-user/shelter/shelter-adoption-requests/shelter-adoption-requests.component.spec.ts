import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterAdoptionRequestsComponent } from './shelter-adoption-requests.component';

describe('ShelterAdoptionRequestsComponent', () => {
  let component: ShelterAdoptionRequestsComponent;
  let fixture: ComponentFixture<ShelterAdoptionRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShelterAdoptionRequestsComponent]
    });
    fixture = TestBed.createComponent(ShelterAdoptionRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
