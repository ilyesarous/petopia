import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/store/products/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  productForm: FormGroup;
  editingProduct: boolean = false;
  isSubmitting: boolean = false;
  previewUrl: any;
  selectedFile: File | null = null;
  categories: string[] = ['FOOD', 'ACCESSORY', 'TOYS', 'CLOTHES'];
  currentProductId: number | null = null;
  userId: number = 0;
  toast: any[]= [];
  @Input() product: any = null;
  @Input() isEditMode: boolean = false;
  @Input() role: string = "";
  @Output() productAdded = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private sanitizer: DomSanitizer
  ) {
    this.productForm = this.fb.group({
      product_name: ['', [Validators.required, Validators.minLength(3)]],
      product_description: [
        '',
        [Validators.required, Validators.minLength(20)],
      ],
      old_price: [0, [Validators.required, Validators.min(0)]],
      // old_price: [0, [Validators.min(0)]],
      cuppon_price: [0, [Validators.min(0), Validators.max(100)]],
      category: ['', Validators.required],
      availableQuantity: [0, [Validators.required, Validators.min(0)]],
    });
  }
  productData: any;
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
      ? parseInt(localStorage.getItem('userId')!)
      : 0;
      if (this.isEditMode && this.product) {
        this.loadProductData(this.product);
      }
  }

  loadProductData(product: any): void {
    this.productForm.patchValue({
      product_name: product.product_name,
      product_description: product.product_description,
      old_price: product.old_price,
      cuppon_price: product.cuppon_price,
      category: product.category,
      availableQuantity: product.availableQuantity
    });
    
    if (product.product_image) {
      this.previewUrl = product.product_image;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(file)
      );
    }
  }

  removeImage(): void {
    this.previewUrl = null;
    this.selectedFile = null;
  }

  setRating(rating: number): void {
    this.productForm.get('rating')?.setValue(rating);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    this.productData = this.productForm.value;

    Object.keys(this.productData).forEach((key) => {
      if (key !== 'product_image') {
        formData.append(key, this.productData[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('product_image', this.selectedFile);
    }else {
      formData.append('product_image', new File([], ''));
    }

    if (this.isEditMode && this.product) {
      formData.append('product_id', this.product.product_id.toString());
      this.updateProduct(formData);
    } else {
      console.log(formData);
      this.createProduct(formData);
    }
  }

  createProduct(formData: FormData): void {
    const priviousProce =
      this.productForm.get('old_price')?.value -
      (this.productForm.get('old_price')?.value *
        this.productForm.get('cuppon_price')?.value) /
        100;
    formData.append('product_price', priviousProce.toString());
    formData.append('id_user', this.userId.toString());
    
    this.productService.addProduct(formData, this.role).subscribe({
      next: (newProduct) => {
        this.productAdded.emit(newProduct);
      },
      error: (err) => {
        console.error('Error creating product:', err);
        this.isSubmitting = false;
      },
    });
  }

  updateProduct(formData: FormData): void {
    const priviousProce =
      this.productForm.get('old_price')?.value -
      (this.productForm.get('old_price')?.value *
        this.productForm.get('cuppon_price')?.value) /
        100;
    formData.append('product_price', priviousProce.toString());
    formData.append('id_user', this.userId.toString());
    this.productService.updateProductPartner(formData).subscribe({
      next: (updatedProduct) => {
        this.productAdded.emit(updatedProduct);
      },
      error: (err) => {
        console.error('Error updating product:', err);
        this.isSubmitting = false;
      },
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

}
