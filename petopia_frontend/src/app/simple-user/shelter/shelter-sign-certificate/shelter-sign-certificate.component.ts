import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from 'src/app/services/adoptions/certificate/certificate.service';

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

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = 400;
    canvas.height = 150;

    let drawing = false;
    canvas.addEventListener('mousedown', () => drawing = true);
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mousemove', (e) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      this.ctx.stroke();
    });
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, 400, 150);
  }

  submitSignature() {
    const canvas = this.canvasRef.nativeElement;
    const base64Signature = canvas.toDataURL('image/png').split(',')[1];
    console.log("Sending signature:1", base64Signature);

    this.certificateService.signAsShelter(this.certificateId, base64Signature).subscribe({

      next: () => {
        console.log("Sending signature:2", base64Signature);

        alert('Signature saved!');
        
        this.router.navigate(['/shelter/certificate',this.certificateId]);
      },
      error: (err) => {
        console.log("Sending signature:3", base64Signature);

        console.error('Failed to sign certificate:', err);
      }
    });
  }
}