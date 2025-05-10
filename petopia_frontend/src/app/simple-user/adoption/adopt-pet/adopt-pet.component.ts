import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdoptionService } from 'src/app/services/adoptions/adoption/adoption.service';
import { faPaw, faCommentDots, faCamera, faHeart } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  selector: 'app-adopt-pet',
  templateUrl: './adopt-pet.component.html',
  styleUrls: ['./adopt-pet.component.css']
})
export class AdoptPetComponent implements OnInit {

  adoptionForm: FormGroup;
  petId!: number;
  selectedFileName: string | null = null;
  faPaw = faPaw;
  faHeart = faHeart;
  faCamera = faCamera;
  faCommentDots = faCommentDots;
  fileError: string = '';
  selectedFile: File | null = null;
  showPopup: boolean = false;
  userId: number = 0;
  userName: string = '';
  cinError: string = '';
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adoptionService: AdoptionService,
    private userService: AuthService
  ) {
    this.adoptionForm = this.fb.group({
      motivation_letter: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    this.userId = storedId ? +storedId : 0;

    this.route.params.subscribe(params => {
      this.petId = +params['idPet'];
      if (!this.petId) {
        console.error('❌ Invalid petId');
        return;
      }
    });

    if (this.userId) {
      this.userService.getCurrentUserById(this.userId).subscribe({
        next: (res) => {
          this.userName = res.ourUsers?.name;
          console.log("✅ Loaded user name:", this.userName);
        },
        error: (err) => {
          console.error("❌ Failed to load user info:", err);
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log("📂 File selected:", file);
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.fileError = '';

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        console.log("👁️ Preview URL set.");
      };
      reader.onerror = (error) => console.error("❌ FileReader error during preview:", error);
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.adoptionForm.invalid) {
      console.warn("⚠️ Adoption form is invalid.");
      return;
    }

    if (!this.petId) {
      console.warn("⚠️ No petId.");
      return;
    }

    if (!this.selectedFile) {
      this.fileError = 'CIN image is required.';
      console.warn("⚠️ No file selected.");
      return;
    }

    console.log("📤 Starting CIN verification...");
    const verified = await this.verifyCinImage();
    if (!verified) {
      this.cinError = "CIN does not match the logged-in user's name.";
      console.warn("❌ CIN verification failed.");
      return;
    }

    this.cinError = '';
    console.log("✅ CIN verification passed.");

    const adoptionPayload = {
      motivation_letter: this.adoptionForm.get('motivation_letter')?.value,
      pet: { idPet: this.petId }
    };

    this.adoptionService.createAdoption(adoptionPayload, this.selectedFile).subscribe({
      next: (res) => {
        console.log('✅ Adoption request created:', res);
        this.showPopup = true;
      },
      error: (err) => {
        console.error('❌ Error submitting request:', err);
        alert('There was an error. Please try again.');
      }
    });
  }

  closePopup(): void {
    this.showPopup = false;
    this.router.navigate(['/adoption']);
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]; // ✅ Only raw part
        console.log("✅ Base64 to send to backend (raw):", base64);
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  verifyCinImage(): Promise<boolean> {
    if (!this.selectedFile || !this.userName) {
      console.warn("⚠️ verifyCinImage aborted: Missing file or username.");
      return Promise.resolve(false);
    }

    return this.convertFileToBase64(this.selectedFile).then((base64Image) => {
      console.log("📡 Sending verification request to Flask API...");
      return fetch('http://spring-service:5002/api/verify_person', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.userName,
          image_path: base64Image
        })
      }).then(res => res.json()).then(data => {
        console.log("📥 Verification API response:", data);
        return data.result.result === true;
      });
    }).catch(err => {
      console.error("❌ CIN verification error:", err);
      return false;
    });
  }
}
