import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-dash',
  templateUrl: './store-dash.component.html',
  styleUrls: ['./store-dash.component.css']
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

  ngOnInit(): void {
    // Initialize with API calls
    this.loadData();
  }

  loadData(): void {
    // Example - replace with actual API calls
    /*
    this.adService.getAllAds().subscribe(ads => {
      this.ads = ads;
      this.adsCount = ads.length;
    });
    */
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  get filteredAds(): any[] {
    return this.ads.filter(ad => {
      const matchesSearch = ad.title.toLowerCase().includes(this.adsSearchQuery.toLowerCase()) || 
                          ad.description.toLowerCase().includes(this.adsSearchQuery.toLowerCase());
      const matchesFilter = this.adsFilter === 'all' || 
                          (this.adsFilter === 'active' && ad.isActive) || 
                          (this.adsFilter === 'inactive' && !ad.isActive);
      return matchesSearch && matchesFilter;
    });
  }

  get filteredBrands(): any[] {
    return this.brands.filter(brand => 
      brand.name.toLowerCase().includes(this.brandsSearchQuery.toLowerCase())
    );
  }

  get filteredPartners(): any[] {
    return this.partners.filter(partner => {
      const matchesSearch = partner.name.toLowerCase().includes(this.partnersSearchQuery.toLowerCase()) || 
                          partner.contactEmail.toLowerCase().includes(this.partnersSearchQuery.toLowerCase());
      const matchesFilter = this.partnersFilter === 'all' || 
                          partner.tier === this.partnersFilter;
      return matchesSearch && matchesFilter;
    });
  }

  openAddAdModal(): void {
    // Implement modal opening logic
    console.log('Open Add Ad Modal');
  }

  openAddBrandModal(): void {
    // Implement modal opening logic
    console.log('Open Add Brand Modal');
  }

  editAd(adId: number): void {
    // Implement edit logic
    console.log('Edit Ad', adId);
  }

  deleteAd(adId: number): void {
    // Implement delete logic
    console.log('Delete Ad', adId);
  }

  editBrand(brandId: number): void {
    // Implement edit logic
    console.log('Edit Brand', brandId);
  }

  deleteBrand(brandId: number): void {
    // Implement delete logic
    console.log('Delete Brand', brandId);
  }

  editPartner(partnerId: number): void {
    // Implement edit logic
    console.log('Edit Partner', partnerId);
  }

  deletePartner(partnerId: number): void {
    // Implement delete logic
    console.log('Delete Partner', partnerId);
  }
}