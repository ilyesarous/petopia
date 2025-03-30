import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetGrowthListComponent } from './pet-growth-list.component';

describe('PetGrowthListComponent', () => {
  let component: PetGrowthListComponent;
  let fixture: ComponentFixture<PetGrowthListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetGrowthListComponent]
    });
    fixture = TestBed.createComponent(PetGrowthListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
