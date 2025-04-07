import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterHomeComponent } from './shelter-home.component';

describe('ShelterHomeComponent', () => {
  let component: ShelterHomeComponent;
  let fixture: ComponentFixture<ShelterHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShelterHomeComponent]
    });
    fixture = TestBed.createComponent(ShelterHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
