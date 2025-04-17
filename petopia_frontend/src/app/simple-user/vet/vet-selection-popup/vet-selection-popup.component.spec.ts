import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetSelectionPopupComponent } from './vet-selection-popup.component';

describe('VetSelectionPopupComponent', () => {
  let component: VetSelectionPopupComponent;
  let fixture: ComponentFixture<VetSelectionPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VetSelectionPopupComponent]
    });
    fixture = TestBed.createComponent(VetSelectionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
