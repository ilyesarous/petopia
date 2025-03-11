import { Component, OnInit } from '@angular/core';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Result } from '@zxing/library';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent implements OnInit {

  codeReader: BrowserQRCodeReader;
  scannedResult: string | null = null;
  scannerControls: any; // Pour stocker les contrôles du scanner

  constructor() {
    this.codeReader = new BrowserQRCodeReader();
  }

  ngOnInit(): void {}

  startScanning(): void {
    this.codeReader
      .decodeFromVideoDevice(undefined, 'video', (result: Result | undefined, err: Error | undefined) => {
        if (result) {
          this.scannedResult = result.getText();
          console.log('QR Code scanned:', this.scannedResult);
        }
        if (err) {
          console.error('Error scanning QR code:', err);
        }
      })
      .then((controls: any) => {
        this.scannerControls = controls; // Stocker les contrôles pour arrêter le scan plus tard
      })
      .catch((err: any) => {
        console.error('Error starting scanner:', err);
      });
  }

  stopScanning(): void {
    if (this.scannerControls) {
      this.scannerControls.stop(); // Arrêter le scan
      this.scannerControls = null;
    }
  }
}