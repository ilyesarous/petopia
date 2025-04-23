import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-receipt-modal',
  templateUrl: './receipt-modal.component.html',
  styleUrls: ['./receipt-modal.component.css']
})
export class ReceiptModalComponent {
  @Input() cartItems: any[] = [];
  @Input() cart: any = {};
  @Input() today: Date = new Date();
  @Output() closeModal = new EventEmitter<void>();
  @Output() proceedToPayment = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }

  onProceed() {
    this.proceedToPayment.emit();
  }

}
