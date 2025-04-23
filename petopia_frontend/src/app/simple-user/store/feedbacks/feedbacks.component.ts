import { Component, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Feedback } from 'src/app/models/product/feedback';
import { Product } from 'src/app/models/product/Product';
import { FeedbackService } from 'src/app/services/store/feedback/feedback.service';
import { ProductService } from 'src/app/services/store/products/product.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.css'],
})
export class FeedbacksComponent implements OnInit {
  feedbackForm: FormGroup;
  showFeedbackForm = false;
  averageRating = 0;
  feedbacks: Feedback[] = []; // You'll populate this from your service
  product!: Product;
  p: number = 1; // Current page
  itemsPerPage: number = 5; // Items per page
  totalItems: number = 0;
  userId: number = 0;
  user : any = {user_id : 0}

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private route: ActivatedRoute
  ) {
    this.feedbackForm = this.fb.group({
      user: {id_user: localStorage.getItem('userId')},
      productId: [this.route.snapshot.paramMap.get('id'), Validators.required],
      stars_number: [5, Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    ? parseInt(localStorage.getItem('userId')!)
    : 0;
    this.user = {user_id: this.userId}
    this.loadFeedbacks();
  }

  showActions(feedback: Feedback): boolean {
    return this.userId === feedback.user.id_user;
  }

  loadFeedbacks(): void {
    // Call your service to get feedbacks for this product
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.feedbackService.getByProductId(+productId).subscribe((feedbacks) => {
        this.feedbacks = feedbacks;
        this.totalItems = feedbacks.length; // Set total items count
        this.averageRating = this.getaverageRating();
      });
    }
  }

  submitFeedback(): void {
    if (this.feedbackForm.valid) {
      // Submit to your backend
      this.feedbackService.create(this.feedbackForm.value).subscribe(() => {
        this.feedbackForm.setValue({
          user: this.user,
          productId: this.route.snapshot.paramMap.get('id'), 
          stars_number: 5,
          description: '',
        });
        this.showFeedbackForm = false;
        this.loadFeedbacks();
      });
    }
  }

  deleteFeedback(feedbackId: number): void {
    this.feedbackService.deleteFeedback(feedbackId).subscribe(() => {
      this.loadFeedbacks();
    })
  };

  getaverageRating(): number {
    if (!this.feedbacks.length) return 0;
    const sum = this.feedbacks.reduce(
      (acc, curr) => acc + curr.stars_number,
      0
    );
    return sum / this.feedbacks.length;
  }

  getRatingPercentage(rating: number): number {
    const count = this.feedbacks.filter(
      (f) => f.stars_number === rating
    ).length;
    return Math.round((count / this.feedbacks.length) * 100) || 0;
  }

  toggleFeedbackForm(): void {
    this.showFeedbackForm = !this.showFeedbackForm;
  }
}
