import { ProductCarousel } from '@/products/components/product-carousel/product-carousel';
import { Product } from '@/products/interfaces/product-respose.interface';
import { ProductsService } from '@/products/services/products.service';
import { FormErrorLabel } from '@/shared/components/form-error-label/form-error-label';
import { FormUtils } from '@/utils/form-utils';
import { Component, computed, inject, input, OnInit,signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'product-details',
  imports: [ProductCarousel,ReactiveFormsModule,FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit{

  product =input.required<Product>();
  router=inject(Router);

  

  ProductService=inject(ProductsService);
  fb=inject(FormBuilder);

  wasSaves = signal(false);
  tempImages=signal<string[]>([]);
  imageFileList: FileList |undefined=undefined;

  imagesToCarrousel=computed(()=>{
    const localcurrentProductImage = [
      ...this.product().images, 
      ...this.tempImages(),
    ];
    //console.log(localcurrentProductImage);
    return localcurrentProductImage;
  }

  );
  productForm=this.fb.group({
    title:['',Validators.required],
    description:['',Validators.required],
    slug:['',[Validators.required,Validators.pattern(FormUtils.slugPattern)]],
    price:[0,[Validators.required,Validators.min(0)]],
    stock:[0,[Validators.required,Validators.min(0)]],
    sizes:[['']],
    images:[[]],
    tags:[''],
    gender:['men',[Validators.required,Validators.pattern(/men|women|kid|unisex/)]],
  });

  sizes=['XS','S','M','L','XL','XXL'];
  ngOnInit(): void {
    //this.productForm.reset(this.product() as any)
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>){
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({tags:formLike.tags?.join(',')});
  
  }

  onSizeClicked(size:string ){

    const currentSizes=this.productForm.value.sizes ?? [];
    if (currentSizes.includes( size)){
      currentSizes.splice(currentSizes.indexOf(size),1);
    }else{
      currentSizes.push(size);
    }

    this.productForm.patchValue({sizes:currentSizes});
  }
  async onSubmit(){
    const isValid=this.productForm.valid;
    this.productForm.markAllAsTouched();
    const formValue=this.productForm.value;
    if (!isValid) return;    
    const productLike:Partial<Product>={
      ...(formValue as any),
      tags:formValue.tags?.toLowerCase().split(',').map(p=>p.trim()) ?? [],
    };
  
    if (this.product().id =='new'){
      //console.log('new');
      const product=await firstValueFrom(
       this.ProductService.createProduct(productLike,this.imageFileList) 
      );
       //this.ProductService.createProduct(productLike).subscribe((product)=>{
          //console.log('producto creado2');
          this.router.navigate(['/admin/products',product.id]);
       //});

    } else {
      await firstValueFrom(
          this.ProductService.updatedProduct(this.product().id,productLike,this.imageFileList)
      )
      }
     this.wasSaves.set(true); 

     setTimeout(()=>{
      this.wasSaves.set(false);
     },3000);
  }

  onFilesChanged(event :Event){
  const filesList =(event.target as HTMLInputElement).files;
  this.imageFileList=filesList ?? undefined;
  //this.tempImages.set([]);
  const imagesUrls= Array.from (filesList ?? []).map((file)=>
    URL.createObjectURL(file)
  );
  console.log(imagesUrls);
  this.tempImages.set(imagesUrls);

}



}
