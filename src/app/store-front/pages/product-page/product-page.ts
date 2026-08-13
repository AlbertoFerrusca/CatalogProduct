import { ProductCarousel } from '@/products/components/product-carousel/product-carousel';
import { ProductsService } from '@/products/services/products.service';
import { Component,inject,input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.html',
})
export class ProductPage {


    activateRoute=inject(ActivatedRoute);

    productSlug:string=this.activateRoute.snapshot.params['idSlug'];

    ProductService=inject(ProductsService);
    productsResource=rxResource({
     params:()=>({idSlug:this.productSlug}),
     stream:({params})=> {
      return  this.ProductService.getProductBySlug(params.idSlug);
   },
})
}
