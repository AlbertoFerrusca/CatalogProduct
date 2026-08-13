import { Product } from '@/products/interfaces/product-respose.interface';
import { Component, inject, input } from '@angular/core';
import { ProductImagePipe } from "../../pipes/product-image.pipe";
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductsService } from '@/products/services/products.service';
import { PaginationService } from '@/shared/components/pagination/paginacion.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'product-table',
  imports: [ProductImagePipe,RouterLink,CurrencyPipe],
  templateUrl: './product-table.html',
})
export class ProductTable {

  product=input.required<Product[]>();

}


