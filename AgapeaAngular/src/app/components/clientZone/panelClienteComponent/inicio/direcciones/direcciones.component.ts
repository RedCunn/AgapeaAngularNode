import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { IDireccion } from '../../../../../models/direccion';
import { ICliente } from '../../../../../models/cliente';
import { Observable, concatMap, map } from 'rxjs';
import { MY_STORAGESERVICES_TOKEN } from '../../../../../services/injectionTokenStorageService';
import { IStorageService } from '../../../../../models/IStorageService';
import { ModaldireccionComponent } from './modaldireccion/modaldireccion.component';
import { IRestMessage } from '../../../../../models/restmessage';
import { RESTnodeService } from '../../../../../services/restnode.service';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrl: './direcciones.component.css'
})
export class DireccionesComponent {

  modalOpen : boolean = false;
  public addressEdit : IDireccion = {
    idDireccion : window.crypto.randomUUID(),
    calle : '',
    pais : '',
    provincia : {CCOM : '', CPRO : '', PRO : ''},
    municipio : {CUN : '', CPRO : '', DMUN50 : '', CMUM : ''},
    cp : 0,
    esFacturacion : false,
    esPrincipal : false
  }

  public datosClienteStorage$:Observable<ICliente|null>;
  public direcciones$:Observable<IDireccion[]>;

  
  @ViewChild('modaldirec') modaldirec!: ModaldireccionComponent;
  @ViewChild('btonNewDireccion') btonNewDireccion!:ElementRef;

  constructor (@Inject(MY_STORAGESERVICES_TOKEN) private storageSvc : IStorageService, private restSvc : RESTnodeService){
    
    this.datosClienteStorage$=this.storageSvc.RetrieveClientData() as Observable<ICliente|null>;
    this.direcciones$=this.datosClienteStorage$
                          .pipe(
                                   map( 
                                        (cliente:ICliente|null) => {
                                                  if(cliente && cliente.direcciones && cliente.direcciones.length > 0) {
                                                      return cliente.direcciones;                                                        
                                                  } else {
                                                    return [];
                                                  }
                                               }
                                      )
                            ) as Observable<IDireccion[]>;
  }

  openModal(){
    this.modalOpen = true;
  }
  closeModal(){
    this.modalOpen = false;
  }

  public async OperateAddress(datos:[IDireccion,string]){
   
    switch (datos[1]) {
      case 'pending-modify':
          //muestro modal con direccion a modificar...
          console.log('vamos a modificar direccion...', datos[0]);

          this.addressEdit=datos[0];
          this.openModal();
          
        break;

      case 'modify-ended':
        break;
      case 'create':
        break;
      case 'remove':
          let subscript=(this.storageSvc.RetrieveClientData() as Observable<ICliente>)
          .pipe(
            concatMap( (_datoscliente:ICliente)=>{
                  return this.restSvc.OperateAddress(datos[0], datos[1],_datoscliente.cuenta.email);
            })
          )
        .subscribe(
          (_resp:IRestMessage)=>{
            if(_resp.code==0)
            {
                  console.log('refrescando datos....',{ datoscliente: _resp.clientdata, jwt: _resp.token! } );
                  //actualziar datos del cliente y token...
                  this.storageSvc.StoreClientData(_resp.clientdata!);
                  this.storageSvc.StoreJWT(_resp.token!);
                  
            } else {
                //mostrar mensaje de error en vista por fallo de operacion en direcciones....
            }    
          }
        );

          subscript.unsubscribe();
        break;

      default:
        console.log('default de operardirecciones', datos);
    }
 
  }
}
