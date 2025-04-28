import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventHelperComponent } from './event-helper.component';

describe('EventHelperComponent', () => {
  let component: EventHelperComponent;
  let fixture: ComponentFixture<EventHelperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventHelperComponent]
    });
    fixture = TestBed.createComponent(EventHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
