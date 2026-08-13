import { map } from 'rxjs/operators';
import { inject,Injectable} from '@angular/core';
import { Gender, Product, ProductsResponse } from '../interfaces/product-respose.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, tap,of,delay, forkJoin, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { User } from '@/auth/interfaces/user.interface';


const baseurl=environment.baseurl;
interface Options {
  limit?:number,
  offset?:number,
  gender?:string,
}

const emptyProduct:Product={
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user:{} as User,
}

@Injectable({providedIn: 'root'})

export class  ProductsService {
    private productCache=new Map<string,ProductsResponse>();
    private onlyProductCache=new Map<string,Product>();

    private http=inject(HttpClient);

    


    getProducts(options: Options):Observable<ProductsResponse>{

      const {limit = 9,offset = 0,gender=''}=options;
      const keyValue=`${limit}-${offset}-${gender}`;

      if (this.productCache.has(keyValue)){
        return of(this.productCache.get(keyValue)!)
      }
      return this.http.get<ProductsResponse>(`${baseurl}/products`,{
      params:{
        limit: limit,
        offset: offset,
        gender: gender,
    }})
    .pipe(
      tap(respuesta=>console.log(respuesta)),
      tap(resp=>this.productCache.set(keyValue,resp))
    );
    }

    getProductBySlug(slug:string):Observable<Product>{
      if (this.onlyProductCache.has(slug)){
        return of(this.onlyProductCache.get(slug)!);
      }
      return this.http.get<Product>(`${baseurl}/products/${slug}`).
      pipe(
        delay(2000),
        tap((product)=>this.onlyProductCache.set(slug,product)));
    }

    getProductById(id:string):Observable<Product>{

    if (id=='new') {
      return of (emptyProduct);
    }   
    if (this.onlyProductCache.has(id)){
        return of(this.onlyProductCache.get(id)!);
      }
      return this.http.get<Product>(`${baseurl}/products/${id}`).
      pipe(
        delay(2000),
        tap((product)=>this.onlyProductCache.set(id,product)));
    }

    updatedProduct(id:string, productLike:Partial<Product>,imageFileList?:FileList): Observable<Product>{
       /*return this.http.patch<Product>(`${baseurl}/products/${id}`,productLike)
       .pipe(
        tap((product)=>this.updateProductCache(product))
       );*/
       
        const currentImages=productLike.images ?? [];

       return this.upLoadImages(imageFileList)
       .pipe(
        map((files) => ({
           ...productLike,
            images: [...currentImages, ...files],
        })),
        switchMap((currentProd)=>
         this.http
         .patch<Product>(`${baseurl}/products/${id}`, currentProd)
        ),
        tap((product) => this.updateProductCache(product))
        );


    }

createProduct(productLike: Partial<Product>,imageFileList?:FileList): Observable<Product> {
  console.log('create');
    return this.http
        .post<Product>(`${baseurl}/products`, productLike)
        .pipe(tap((product) => this.updateProductCache(product)));
}


 updateProductCache(product:Product){
      const productid=product.id;
      this.onlyProductCache.set(productid,product);
      this.productCache.forEach(productResp=>{
         productResp.products=productResp.products.map(
          (currentProduct)=>{
            return currentProduct.id==productid ? product : currentProduct;

          }
        );
      })

    }
 
upLoadImages(images?:FileList):Observable<string[]>{
   if (!images) return of ([]);
   const uploadObserables=Array.from(images).map((file)=>
     this.upLoadImage(file)
  );
  return forkJoin(uploadObserables)
  .pipe(tap((images)=>console.log({images})));

}
upLoadImage(images:File):Observable<string>{
   const formData=new FormData();
   formData.append('file',images);

   return this.http
   .post<{fileName:string}>(`${baseurl}/files/product`,formData)
   .pipe(map((resp)=> resp.fileName));

}

}


