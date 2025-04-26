import { Component, OnInit } from '@angular/core';
import { BrandsService } from 'src/app/services/store/brands/brands.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit{

  constructor(private brandService: BrandsService){}

  stories: any[] = [];

  ngOnInit(): void {
    this.brandService.getAllBrandsUser().subscribe(
      brand => this.stories = brand
    )
  }

}
