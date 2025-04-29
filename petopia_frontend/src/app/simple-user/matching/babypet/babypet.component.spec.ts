import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabypetComponent } from './babypet.component';

describe('BabypetComponent', () => {
  let component: BabypetComponent;
  let fixture: ComponentFixture<BabypetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BabypetComponent]
    });
    fixture = TestBed.createComponent(BabypetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
