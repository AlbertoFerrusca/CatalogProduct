import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../service/auth.service";

export function authInterceptor(
  req:HttpRequest<unknown>,
  next:HttpHandlerFn
){
  const Token=inject(AuthService).token();
  const newReq=req.clone({
    headers:req.headers.append(
      'Authorization',`Bearer ${Token}`,),
  });
  return next(newReq);
}
