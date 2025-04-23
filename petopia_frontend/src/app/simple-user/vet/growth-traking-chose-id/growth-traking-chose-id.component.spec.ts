import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthTrakingChoseIdComponent } from './growth-traking-chose-id.component';

describe('GrowthTrakingChoseIdComponent', () => {
  let component: GrowthTrakingChoseIdComponent;
  let fixture: ComponentFixture<GrowthTrakingChoseIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrowthTrakingChoseIdComponent]
    });
    fixture = TestBed.createComponent(GrowthTrakingChoseIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
