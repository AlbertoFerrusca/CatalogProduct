import { Routes } from "@angular/router";
import {AuthLayout} from "../auth/layout/auth-layout/auth-layout";
import {LoggingPage} from "../auth/pages/logging-page/logging-page";
import { RegisterPage } from "./pages/register-page/register-page";

export const authRoutes:Routes=[
{
  path:'',
  component:AuthLayout,
   children:[
    {
      path:'login',
      component:LoggingPage,


    },
{
      path:'register',
      component:RegisterPage,


    },
    {
      path:"**",
      redirectTo:'login'
    }

   ]


}

]
export default authRoutes;
