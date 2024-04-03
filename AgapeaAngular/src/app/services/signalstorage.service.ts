import { Injectable, signal } from '@angular/core';
import { IStorageService } from '../models/IStorageService';
import { Observable } from 'rxjs';
import { ICliente } from '../models/cliente';
import { ILibro } from '../models/libro';

@Injectable({
  providedIn: 'root'
})
export class SignalstorageService implements IStorageService{

  private clienteSignal = signal<ICliente | null>(null);


  constructor() { }

  StoreClientData(clientdata: ICliente): void {
    this.clienteSignal.update(()=> clientdata);
  }
  StoreJWT(jwt: string): void {
    throw new Error('Method not implemented.');
  }
  RetrieveClientData(): Observable<ICliente | null> {
    throw new Error('Method not implemented.');
  }
  RetrieveJWT(): Observable<string> {
    throw new Error('Method not implemented.');
  }
  RetrieveOrderItems(): Observable<{ libroElemento: ILibro; cantidadElemento: number; }[]> {
    throw new Error('Method not implemented.');
  }
  OperateOrderItems(book: ILibro, quantity: number, operation: string): void {
    throw new Error('Method not implemented.');
  }
}
