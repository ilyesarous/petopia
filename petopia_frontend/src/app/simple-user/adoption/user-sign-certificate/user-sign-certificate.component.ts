import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from 'src/app/services/adoptions/certificate/certificate.service';
import { generateKeyPair, signData, exportPublicKey } from 'src/app/utils/crypto-utils';

@Component({
  selector: 'app-user-sign-certificate',
  templateUrl: './user-sign-certificate.component.html',
  styleUrls: ['./user-sign-certificate.component.css']
})
export class UserSignCertificateComponent implements OnInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  certificateId!: number;
  private ctx!: CanvasRenderingContext2D;

  constructor(
    private route: ActivatedRoute,
    private certificateService: CertificateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.certificateId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = 500;
    canvas.height = 180;

    let drawing = false;

    canvas.addEventListener('mousedown', (e) => {
      drawing = true;
      const rect = canvas.getBoundingClientRect();
      this.ctx.beginPath();
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

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.ctx.beginPath();
  }

  async submitSignature() {
    const canvas = this.canvasRef.nativeElement;
    const base64Image = canvas.toDataURL('image/png').split(',')[1];
    const timestamp = new Date().toISOString();
    const payload = `certificateId:${this.certificateId};timestamp:${timestamp}`;

    const keyPair = await generateKeyPair();
    const digitalSignature = await signData(keyPair.privateKey, payload);
    const publicKey = await exportPublicKey(keyPair.publicKey);

    const data = {
      base64SignatureImage: base64Image,
      base64DigitalSignature: digitalSignature,
      base64PublicKey: publicKey,
      certificateId: this.certificateId,
      timestamp: timestamp
    };

    this.certificateService.signAsUserPKI(data).subscribe({
      next: () => {
        alert('Signature saved and verified!');
        this.router.navigate(['/adoption/certificate', this.certificateId]);
      },
      error: (err) => {
        console.error('Failed to sign certificate:', err);
        alert('Something went wrong while signing.');
      }
    });
  }
}
