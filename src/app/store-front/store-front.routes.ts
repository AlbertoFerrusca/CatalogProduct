import { Routes } from '@angular/router';
import { StoreFrontLayout } from './layouts/store-front-layout/store-front-layout';
import { HomePageComponent } from './pages/home-page.component/home-page.component';
import { GenderPage } from './pages/gender-page/gender-page';
import { ProductPage } from './pages/product-page/product-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';


export const storeFrontRoutes:Routes=[
  {
    path:'',
    component:StoreFrontLayout,
    children:[
      {
       path:'',
       component:HomePageComponent,
      },
      {
       path:'gender/:gender',
       component:GenderPage,
      },
      {
       path:'product/:idSlug',
       component:ProductPage,
      },
      {
       path:'**',
       component:NotFoundPage,
      },
    ],
  },
{
    path:'**',
    redirectTo:'',
  },

]
export default storeFrontRoutes;
