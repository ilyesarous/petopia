import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterSignCertificateComponent } from './shelter-sign-certificate.component';

describe('ShelterSignCertificateComponent', () => {
  let component: ShelterSignCertificateComponent;
  let fixture: ComponentFixture<ShelterSignCertificateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShelterSignCertificateComponent]
    });
    fixture = TestBed.createComponent(ShelterSignCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
