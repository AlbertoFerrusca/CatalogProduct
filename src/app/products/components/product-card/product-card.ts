import { Component,computed,input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Product, ProductsResponse } from '../../interfaces/product-respose.interface';
import { SlicePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';

const baseurl=environment.baseurl;

@Component({
  selector: 'product-card',
  imports: [RouterLink,SlicePipe,ProductImagePipe],
  templateUrl: './product-card.html',
})
export class ProductCard {

  products=input.required<Product>();

  imageUrl=computed(() => {
    return `${baseurl}/files/product/${this.products().images[0]}`;
  })

}
