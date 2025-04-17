import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSpecificVetComponent } from './info-specific-vet.component';

describe('InfoSpecificVetComponent', () => {
  let component: InfoSpecificVetComponent;
  let fixture: ComponentFixture<InfoSpecificVetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoSpecificVetComponent]
    });
    fixture = TestBed.createComponent(InfoSpecificVetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
