import { Injectable } from '@angular/core';
import { IStorageService } from '../models/IStorageService';
import { ICliente } from '../models/cliente';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ILibro } from '../models/libro';

@Injectable({
  providedIn: 'root'
})
export class SubjectstorageService implements IStorageService{
  
  private _clientSubject$ : BehaviorSubject<ICliente> = new BehaviorSubject<ICliente>({idCliente: '', nombre : '', apellidos : '', telefono: '', cuenta:{email:'',login: '',cuentaActiva:false,imagenAvatarBASE64:'', password:''}});
  private _jwtSubject$ : BehaviorSubject<string> = new  BehaviorSubject<string>('');
  private _orderItemsSubject$ : BehaviorSubject<{libroElemento : ILibro, cantidadElemento : number}[]> = new  BehaviorSubject<{libroElemento : ILibro, cantidadElemento : number}[]>([]);
  
  private _elementosPedido:{ libroElemento:ILibro, cantidadElemento:number}[]=[];

  constructor() { 
    this._orderItemsSubject$.asObservable().subscribe(elementos => this._elementosPedido=elementos);
  }
  

  OperateOrderItems(book : ILibro, quantity: number, operation: string): void {
    
    let _itposition = this._orderItemsSubject$.value.findIndex(it => it.libroElemento.ISBN13 === book.ISBN13);
    
    switch (operation) {
      case 'add':
        if(_itposition != -1){
          this._elementosPedido[_itposition].cantidadElemento += quantity;
          // this._orderItemsSubject$.value[_itposition].cantidadElemento += quantity;
        }else{
          this._orderItemsSubject$.value.push({libroElemento : book, cantidadElemento : 1});
        }
        break;
      case 'remove':
        if(_itposition != -1){
          //this._orderItemsSubject$.value.splice(_itposition,1);
          this._elementosPedido.splice(_itposition, 1);
        }
      break;
      case 'modify':
        if(_itposition != -1){
          //this._orderItemsSubject$.value[_itposition].cantidadElemento = quantity;
          this._elementosPedido[_itposition].cantidadElemento = quantity;
        }
      break;
      default:
        break;
    }
    this._orderItemsSubject$.next(this._elementosPedido);

  }

  RetrieveOrderItems(): Observable<{ libroElemento: ILibro; cantidadElemento: number; }[]> {
    return this._orderItemsSubject$.asObservable();
  }
  RetrieveClientData(): Observable<ICliente | null> {
    return this._clientSubject$.asObservable();
}
  RetrieveJWT(): Observable<string> {
    return this._jwtSubject$.asObservable();
  }
  StoreClientData(clientdata: ICliente): void {
    this._clientSubject$.next(clientdata);
  }
  StoreJWT(jwt: string): void {
    this._jwtSubject$.next(jwt);
  }
  
}
