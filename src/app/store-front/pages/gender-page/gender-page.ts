import { Component, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProductsService } from '@/products/services/products.service';
import {ProductCard} from '../../../products/components/product-card/product-card';
import { PaginationService } from '@/shared/components/pagination/paginacion.service';
import { Pagination } from '@/shared/components/pagination/pagination';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard,Pagination],
  templateUrl: './gender-page.html',
})
export class GenderPage {

  route=inject(ActivatedRoute)
  gender = toSignal(
    this.route.params.pipe(
      map(({ gender }) => gender)
    )
  )
ProductsService=inject(ProductsService);
paginationService=inject(PaginationService);

productsResource=rxResource({
  params:()=>({gender:this.gender(),page:this.paginationService.currentPage()-1}),
  stream:({params})=> {
   return  this.ProductsService.getProducts({gender:params.gender,offset:params.page*9});
   },
})

}

