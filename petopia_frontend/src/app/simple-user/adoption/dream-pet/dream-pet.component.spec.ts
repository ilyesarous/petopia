import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DreamPetComponent } from './dream-pet.component';

describe('DreamPetComponent', () => {
  let component: DreamPetComponent;
  let fixture: ComponentFixture<DreamPetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DreamPetComponent]
    });
    fixture = TestBed.createComponent(DreamPetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
