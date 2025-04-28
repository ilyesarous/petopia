import { Component, OnInit } from '@angular/core';
import { AdsService } from 'src/app/services/store/ads/ads.service';
import { BrandsService } from 'src/app/services/store/brands/brands.service';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  selector: 'app-store-dash',
  templateUrl: './store-dash.component.html',
  styleUrls: ['./store-dash.component.css'],
})
export class StoreDashComponent implements OnInit {
  activeTab: string = 'ads';
  adsCount: number = 0;
  brandsCount: number = 0;
  partnersCount: number = 0;

  // Ads
  adsSearchQuery: string = '';
  adsFilter: string = 'all';
  ads: any[] = []; // Populate from your API

  // Brands
  brandsSearchQuery: string = '';
  brands: any[] = []; // Populate from your API

  // Partners
  partnersSearchQuery: string = '';
  partnersFilter: string = 'all';
  partners: any[] = []; // Populate from your API

  constructor(
    private adService: AdsService,
    private brandService: BrandsService,
    private userService: AuthService
  ) {}
  ngOnInit(): void {
    // Initialize with API calls
    this.loadData();
  }

  loadData(): void {
    // Example - replace with actual API calls

    this.adService.getAllAds().subscribe((ads) => {
      this.ads = ads;
      this.adsCount = ads.length;
    });
    this.brandService.getAllBrands().subscribe((brand) => {
      console.log(brand);

      this.brands = brand;
      this.brandsCount = brand.length;
    });
    this.userService.getAllPartners().subscribe((partner) => {
      console.log(partner);

      this.partners = partner;
      this.partnersCount = partner.length;
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  isTabActive(tabName: string): boolean {
    return this.activeTab === tabName;
  }

  get filteredAds(): any[] {
    return this.ads.filter((ad) => {
      const matchesSearch =
        ad.title.toLowerCase().includes(this.adsSearchQuery.toLowerCase()) ||
        ad.description
          .toLowerCase()
          .includes(this.adsSearchQuery.toLowerCase());
      const matchesFilter =
        this.adsFilter === 'all' ||
        (this.adsFilter === 'active' && ad.isActive) ||
        (this.adsFilter === 'inactive' && !ad.isActive);
      return matchesSearch && matchesFilter;
    });
  }

  get filteredBrands(): any[] {
    return this.brands.filter((brand) =>
      brand.name.toLowerCase().includes(this.brandsSearchQuery.toLowerCase())
    );
  }

  get filteredPartners(): any[] {
    return this.partners.filter((partner) => {
      const matchesSearch =
        partner.name
          .toLowerCase()
          .includes(this.partnersSearchQuery.toLowerCase()) ||
        partner.contactEmail
          .toLowerCase()
          .includes(this.partnersSearchQuery.toLowerCase());
      const matchesFilter =
        this.partnersFilter === 'all' || partner.tier === this.partnersFilter;
      return matchesSearch && matchesFilter;
    });
  }

  // In your parent component (e.g., ads-list.component.ts)
  showAddAdPopup = false;
  showBrandAddPopup = false;

  openAddPopup(): void {
    this.showAddAdPopup = true;
  }

  closeAddPopup(): void {
    this.showAddAdPopup = false;
  }

  onAdAdded(newAd: any): void {
    this.loadData();
    this.closeAddPopup();
  }

  openAddBrandPopup(): void {
    this.showBrandAddPopup = true;
  }

  closeAddBrandPopup(): void {
    this.showBrandAddPopup = false;
  }

  onBrandAdded(newBrand: any): void {
    // Refresh your brands list or add the new brand directly
    this.loadData();
    this.closeAddPopup();
  }

  deleteAd(id: number) {
    this.adService.deleteAd(id).subscribe((res) => this.loadData());
  }
  deleteBrand(id: number){
    this.brandService.deleteBrand(id).subscribe((res) => this.loadData())
  }
}
