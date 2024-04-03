import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, concatMap, first, tap} from 'rxjs';
import { MY_STORAGESERVICES_TOKEN } from '../injectionTokenStorageService';
import { IStorageService } from '../../models/IStorageService';

@Injectable()
export class AuthjwtInterceptor implements HttpInterceptor {

  // interceptor para añadir en todas las peticiones ajax HTTP-REQUEST a servicios nodejs la cabecera 
  // Authentication : Bearer ...
  // si no hay jwt almacenado por el servicio IStorageService, no cambio pet.original
  constructor(@Inject(MY_STORAGESERVICES_TOKEN) private storageSvc : IStorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    return this.storageSvc.RetrieveJWT()
                          .pipe( //tap ((jwt:string )=> console.log('TAMOS INTERCEPTANDO PARA CABECEAR JWT : ',jwt)),
                                 //METEMOS FIRST 
                                 first(),
                                 concatMap(jwt => {
                                                                    if(jwt != null || jwt != ''){
                                                                      const _clonereq = request.clone({setHeaders : {Authorization : `Bearer ${jwt}`}});
                                                                      return next.handle(_clonereq);
                                                                    }else{
                                                                      return next.handle(request);
                                                                    }
                                                                    
                                                                  }));
  }
}
