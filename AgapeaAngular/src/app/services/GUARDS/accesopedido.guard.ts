import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, of, tap } from 'rxjs';
import { MY_STORAGESERVICES_TOKEN } from '../injectionTokenStorageService';
import { IStorageService } from '../../models/IStorageService';
import { ICliente } from '../../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class AccesopedidoGuard implements CanActivate {

  private _obsAccess : Observable<boolean | UrlTree> = of(true);

  constructor(@Inject(MY_STORAGESERVICES_TOKEN) private storageSvc : IStorageService, private router : Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      this._obsAccess = this.storageSvc
                            .RetrieveClientData()
                            .pipe(
                              tap((clidata : ICliente | null) => {console.log('CLIENTDATA FROM GUARD: ',clidata)}),
                              map((clidata)=>{
                                                            if(clidata != null && clidata.cuenta.email != ''){
                                                              return true;
                                                            }else{
                                                              return this.router.createUrlTree(['/Cliente/Login']);
                                                            }
                                                  })
                            );

      return this._obsAccess;
  }
  
}
