import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Consultation } from 'src/app/models/vet/consultation';

@Component({
  selector: 'app-consultation-details-modal',
  templateUrl: './consultation-details-modal.component.html',
  styleUrls: ['./consultation-details-modal.component.css']
})
export class ConsultationDetailsModalComponent {
  @Input() consultation: Consultation | null = null;
  @Input() visible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() statusUpdated = new EventEmitter<string>();

  selectedStatus: string = 'waiting';

  ngOnChanges() {
    if (this.consultation) {
      this.selectedStatus = this.consultation.statusT || 'waiting';
    }
  }

  close() {
    this.closeModal.emit();
  }

  updateStatus() {
    if (this.selectedStatus && this.consultation) {
      this.statusUpdated.emit(this.selectedStatus);
      this.close();
    }
  }
}