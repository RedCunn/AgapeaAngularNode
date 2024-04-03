import { Observable } from "rxjs";
import { ICliente } from "./cliente";
import { IPedido } from "./pedido";
import { ILibro } from "./libro";

export interface IStorageService {
    //#region -------- SYNC para LocalStorage, SubjectStorageService...-------------
    StoreClientData (clientdata : ICliente) : void ;
    StoreJWT(jwt : string) : void;

    RetrieveClientData() : Observable<ICliente|null>; // <- lo podiamos hacer devolviendo valor de tipo ICLiente, pero con el observable aprovechamos pipe : async
    RetrieveJWT (): Observable<string>;

    RetrieveOrderItems () : Observable<{libroElemento : ILibro, cantidadElemento : number}[]> ;
    OperateOrderItems (book : ILibro, quantity : number, operation : string) : void;
    //#endregion
    
    //#region ---------- ASYNC para IndexedDB ------------------
    
    //#endregion
}