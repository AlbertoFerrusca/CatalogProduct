import { Component, inject} from '@angular/core';
import { ProductCard } from '../../../products/components/product-card/product-card';
import { ProductsService } from '../../../products/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import {Pagination} from '@shared/components/pagination/pagination';
import { PaginationService} from '@shared/components/pagination/paginacion.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-home-page.component',
  imports: [ProductCard,Pagination],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
ProductsService=inject(ProductsService);

/*
activateRoute=inject(ActivatedRoute);


currentPage = toSignal(
    this.activateRoute.queryParamMap.pipe(
    map(params=>(params.get('page') ?+params.get('page')!:1)),
    map((page)=>(isNaN(page)?1:page)),
  ),
  {initialValue:1}
)
*/

paginationService=inject(PaginationService);

productsResource=rxResource({
  params:()=>({page:this.paginationService.currentPage()-1}),
  stream:({params})=> {
   return  this.ProductsService.getProducts({offset:params.page*9});
   },
})

}
