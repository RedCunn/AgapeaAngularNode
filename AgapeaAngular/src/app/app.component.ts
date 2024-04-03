import { Component, Inject } from '@angular/core';
import {  NavigationStart, Router, RouterEvent } from '@angular/router';
import { Observable, Subscription, filter, last, map, of, switchMap, take, tap } from 'rxjs';
import { MY_STORAGESERVICES_TOKEN } from './services/injectionTokenStorageService';
import { IStorageService } from './models/IStorageService';
import { ICliente } from './models/cliente';
import { ILibro } from './models/libro';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  public routerEvent$ : Observable<RouterEvent>;
  public pattern: RegExp = new RegExp("(/Cliente/(Login|Registro|Panel)|/Tienda/Pedido)", "g");
  //*la opcion "g" (global) del metodo buscará todas las coincidencias en lugar de detenerse al encontrar la primera
  
  public clientdata$! : Observable<ICliente | null>;
  public itemsList$ !: Observable<{ libroElemento: ILibro, cantidadElemento: number }[]>;
  private _itemsListSubscription! : Subscription;
  public count : number = 0;
  constructor(private router : Router, @Inject(MY_STORAGESERVICES_TOKEN) private storageSvc : IStorageService){
    this.clientdata$ = new Observable<ICliente | null>();
    this.routerEvent$ = router.events
                              .pipe(
                                  //tap(ev => console.log(ev)),
                                  map (ev => ev as RouterEvent),
                                  filter ((ev,i)=> ev instanceof NavigationStart)
                                    ); 
    // router.events.subscribe(
    //   (ev)=>{
    //     if(ev instanceof NavigationStart){
    //       if(new RegExp("(/Cliente/(Login|Registro)|/Tienda/MostrarPedido)").test(ev.url)){
    //         this.showPanel = "";
    //       }else{
    //         this.showPanel = new RegExp("/Cliente/Panel/*").test(ev.url) ? 'panelCliente' : 'panelTienda';
    //       }
    //     }
    //   }
    // )
  }

  ngOnInit() {
    
    this.clientdata$ = this.storageSvc.RetrieveClientData().pipe(
      tap(cli => console.log('ON INIT : ',cli))
    );

    this._itemsListSubscription = this.storageSvc
                                      .RetrieveOrderItems()
                                      .subscribe(items => { this.count = items.reduce((total, item) => total + item.cantidadElemento, 0);
    });
  }
  ngOnDestroy() {
    if (this._itemsListSubscription) {
      this._itemsListSubscription.unsubscribe();
    }
  }
  

}
