import { ProductTable } from '@/products/components/product-table/product-table';
import { ProductsService } from '@/products/services/products.service';
import { PaginationService } from '@/shared/components/pagination/paginacion.service';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Pagination } from "@/shared/components/pagination/pagination";
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, RouterModule],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {

  productService=inject(ProductsService);
  paginationService=inject(PaginationService);
  productPerPage=signal(10);

  productResources= rxResource({
    params:()=>({page:this.paginationService.currentPage()-1,
      limit:this.productPerPage()
    }),
    stream:({params})=>{
     return this.productService.getProducts({
       offset:params.page*9,
       limit:params.limit,
     });
    }
  });

  onperPageChange(event:Event){
   const valueN=Number((event.target as HTMLSelectElement).value);
   this.productPerPage.set(valueN);
  }

}
