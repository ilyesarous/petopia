import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmiResultDialogComponent } from './bmi-result-dialog.component';

describe('BmiResultDialogComponent', () => {
  let component: BmiResultDialogComponent;
  let fixture: ComponentFixture<BmiResultDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BmiResultDialogComponent]
    });
    fixture = TestBed.createComponent(BmiResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
