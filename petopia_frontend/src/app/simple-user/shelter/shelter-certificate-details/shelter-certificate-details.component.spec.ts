import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterCertificateDetailsComponent } from './shelter-certificate-details.component';

describe('ShelterCertificateDetailsComponent', () => {
  let component: ShelterCertificateDetailsComponent;
  let fixture: ComponentFixture<ShelterCertificateDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShelterCertificateDetailsComponent]
    });
    fixture = TestBed.createComponent(ShelterCertificateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
