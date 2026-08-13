import { ProductsService } from '@/products/services/products.service';
import { Component, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ProductDetails } from './product-details/product-details';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetails],
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage {

  activatedRouted=inject(ActivatedRoute);
  router=inject(Router);


  productID=toSignal(
   this.activatedRouted.params.pipe(
    map(params=>params['id'])
   ),
  );
  productService=inject(ProductsService);
productResource=rxResource({
  params:()=>({id:this.productID()}),
  stream:({params})=>{
    return this.productService.getProductById(params.id)
  }
});

redirectEffect=effect(()=>{
 if (this.productResource.error()){
  this.router.navigate(['/admin/products']);
 }
});

}
