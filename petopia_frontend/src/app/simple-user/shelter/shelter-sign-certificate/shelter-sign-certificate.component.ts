import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from 'src/app/services/adoptions/certificate/certificate.service';
import { generateKeyPair, signData, exportPublicKey } from 'src/app/utils/crypto-utils';

@Component({
  selector: 'app-shelter-sign-certificate',
  templateUrl: './shelter-sign-certificate.component.html',
  styleUrls: ['./shelter-sign-certificate.component.css']
})
export class ShelterSignCertificateComponent implements OnInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  certificateId!: number;

  constructor(
    private route: ActivatedRoute,
    private certificateService: CertificateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.certificateId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = 400;
    canvas.height = 150;

    let drawing = false;

    canvas.addEventListener('mousedown', (e) => {
      drawing = true;
      this.ctx.beginPath();
      const rect = canvas.getBoundingClientRect();
      this.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener('mouseup', () => {
      drawing = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      this.ctx.stroke();
    });
  }

  clearCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.beginPath();
  }

  async submitSignature(): Promise<void> {
    const canvas = this.canvasRef.nativeElement;
    const base64SignatureImage = canvas.toDataURL('image/png').split(',')[1];

    const timestamp = new Date().toISOString();
    const payload = `certificateId:${this.certificateId};timestamp:${timestamp}`;

    try {
      const keyPair = await generateKeyPair();
      const base64DigitalSignature = await signData(keyPair.privateKey, payload);
      const base64PublicKey = await exportPublicKey(keyPair.publicKey);

      const requestBody = {
        base64SignatureImage,
        base64DigitalSignature,
        base64PublicKey,
        certificateId: this.certificateId,
        timestamp
      };

      this.certificateService.signAsShelterPKI(requestBody).subscribe({
        next: () => {
          alert('Signed and submitted with PKI!');
          this.router.navigate(['/shelter/certificate', this.certificateId]);
        },
        error: (err) => {
          console.error('Failed to submit PKI signature', err);
          alert('Error during PKI signing. Check console.');
        }
      });
    } catch (error) {
      console.error('PKI signing error:', error);
      alert('Something went wrong during digital signing.');
    }
  }
}
