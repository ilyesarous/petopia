import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VetCalendarComponent } from './vet-calendar.component';

describe('VetCalendarComponent', () => {
  let component: VetCalendarComponent;
  let fixture: ComponentFixture<VetCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VetCalendarComponent]
    });
    fixture = TestBed.createComponent(VetCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
