import { Injectable } from '@angular/core';
import { IStorageService } from '../models/IStorageService';
import { ICliente } from '../models/cliente';
import { Observable, of } from 'rxjs';
import { ILibro } from '../models/libro';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService implements IStorageService{

  constructor() { }
  
  RetrieveOrderItems(): Observable<[{ libroElemento: ILibro; cantidadElemento: number; }]> {
    throw new Error('Method not implemented.');
  }
  OperateOrderItems(book: ILibro, quantity: number, operation: string): void {
    throw new Error('Method not implemented.');
  }
  RetrieveClientData(): Observable<ICliente | null> {
    let _clientdata : ICliente = JSON.parse(localStorage.getItem('clientdata')!) as ICliente;
    return of(_clientdata);
  }
  RetrieveJWT(): Observable<string> {
    let _jwt = localStorage.getItem('jwt')!;
    return of(_jwt);
  }
  StoreClientData(clientdata: ICliente): void {
    localStorage.setItem('clientdata', JSON.stringify(clientdata));
  }
  StoreJWT(jwt: string): void {
    localStorage.setItem('jwt', jwt);
  }
  
}
