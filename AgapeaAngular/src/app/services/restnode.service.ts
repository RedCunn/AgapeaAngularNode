import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, last, lastValueFrom } from 'rxjs';
import { IRestMessage } from '../models/restmessage';
import { ILibro } from '../models/libro';
import { ICategoria } from '../models/categoria';
import { IProvincia } from '../models/provincia';
import { IMunicipio } from '../models/municipio';
import { IDireccion } from '../models/direccion';
import { IPedido } from '../models/pedido';
import { MY_STORAGESERVICES_TOKEN } from './injectionTokenStorageService';
import { IStorageService } from '../models/IStorageService';

@Injectable({
  providedIn: 'root'
})
// servicio para poder hacer peticiones rest al servicio restful de nodejs
export class RESTnodeService {
  constructor(private _httpclient: HttpClient, @Inject(MY_STORAGESERVICES_TOKEN) private storageSvc : IStorageService) { }

  //#region ---------- ZONA CLIENTE -----------------------------
  public loginClient(credentials: { email: string, password: string }): Promise<IRestMessage> {

    const _observable = this._httpclient.post<IRestMessage>("http://localhost:3000/api/Cliente/Login",
      credentials,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      });

    return lastValueFrom(_observable);
  }

  public signupClient(regData: any): Promise<IRestMessage> {

    const _observable = this._httpclient.post<IRestMessage>("http://localhost:3000/api/Cliente/Signup",
      regData,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      });

    return lastValueFrom(_observable);
  }

  public checkEmailExists(email: string): Observable<IRestMessage> {

    return this._httpclient.get(`http://localhost:3000/api/Cliente/CheckEmail?email=${email}`) as Observable<IRestMessage>;

  }

  public activateAccount(mode: string | null, oobCode: string | null, apiKey: string | null): Observable<IRestMessage> {
    return this._httpclient.get(`http://localhost:3000/api/Cliente/ActivateAccount?mod=${mode}&cod=${oobCode}&key=${apiKey}`) as Observable<IRestMessage>;
  }

  public addNewAddress(addr: { address: IDireccion, email: string }): Promise<IRestMessage> {
    const _promise = this._httpclient.post<IRestMessage>("http://localhost:3000/api/Cliente/AddAddress",
      addr,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
    return lastValueFrom(_promise);
  }

  

  public async UploadImage (imgBASE64:string, email: string) : Promise<IRestMessage>{
    return await lastValueFrom(
      this._httpclient.post<IRestMessage>(
                                         'http://localhost:3000/api/Cliente/UploadImage',
                                         {imagen: imgBASE64, emailcliente: email },
                                         { headers: new HttpHeaders( {'Content-Type':'application/json'}) }
                                         )
                      );
  }

  public async OperateAddress (direccion : IDireccion , operation : string, email : string) : Promise<IRestMessage>{
    console.log("en servicio, metodo operateAddress, mandando ...", {direccion, operation, email})

    return await lastValueFrom(
                                this._httpclient.post<IRestMessage>(
                                                                                'http://localhost:3000/api/Cliente/OperateAddress',
                                                                                {direccion, operation, email},
                                                                                {headers : new HttpHeaders ({'content-Type':'application/json'})}  
                                                                            )

                              );
  }
  //#endregion

  //#region ---------------------- ZONA TIENDA -------------------------
  public retrieveCategories(catid: string): Observable<ICategoria[]> {
    if (!!catid) catid = 'root';
    return this._httpclient.get<ICategoria[]>(`http://localhost:3000/api/Tienda/RetrieveCategories?catid=${catid}`);
  }
  public booksByCategory(catid: string): Observable<ILibro[]> {
    if (catid == null || catid == undefined || catid == '') catid = '2-10';
    return this._httpclient.get<ILibro[]>(`http://localhost:3000/api/Tienda/RetrieveBooksByCategory?catid=${catid}`);
  }
  public singleBookByISBN(isbn: string): Observable<ILibro> {
    return this._httpclient.get<ILibro>(`http://localhost:3000/api/Tienda/RetrieveSingleBookByISBN?isbn=${isbn}`);
  }
  public retrieveProvincias(): Observable<IProvincia[]> {
    return this._httpclient.get<IProvincia[]>('http://localhost:3000/api/Tienda/RetrieveProvincias');
  }
  public retrieveMunicipios(codpro: string): Observable<IMunicipio[]> {
    return this._httpclient.get<IMunicipio[]>(`http://localhost:3000/api/Tienda/RetrieveMunicipios?codpro=${codpro}`);
  }

  public async CompleteOrder(order : IPedido, email : string, sessiontoken : string) : Promise<IRestMessage>{

    console.log('JWT COMPLETE ORDER : ', sessiontoken)

    return await lastValueFrom(
                          this._httpclient.post<IRestMessage>(
                                "http://localhost:3000/api/Tienda/CompleteOrder",
                                { order, email, sessiontoken},
                                { headers: new HttpHeaders({'Content-Type':'application/json'}) }
                                  )
                              );
  }
  //#endregion
}