import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationFormComponent } from './participation-form.component';

describe('ParticipationFormComponent', () => {
  let component: ParticipationFormComponent;
  let fixture: ComponentFixture<ParticipationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipationFormComponent]
    });
    fixture = TestBed.createComponent(ParticipationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
