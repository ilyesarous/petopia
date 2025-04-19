import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchbackComponent } from './matchback.component';

describe('MatchbackComponent', () => {
  let component: MatchbackComponent;
  let fixture: ComponentFixture<MatchbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchbackComponent]
    });
    fixture = TestBed.createComponent(MatchbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
