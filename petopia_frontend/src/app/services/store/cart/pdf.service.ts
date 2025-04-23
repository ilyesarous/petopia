import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() {}

  async generatePdf(htmlContent: HTMLElement, fileName: string): Promise<void> {
    try {
      // Set scale for better quality
      const options = {
        scale: 2, // Increase for higher quality
        logging: false,
        useCORS: true, // If you have external images
        allowTaint: true // If you have external images
      };

      const canvas = await html2canvas(htmlContent, options);
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions to fit the page
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight) * 0.95;
      const imgX = (pageWidth - imgWidth * ratio) / 2;
      const imgY = 10; // Small margin from top
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
}
