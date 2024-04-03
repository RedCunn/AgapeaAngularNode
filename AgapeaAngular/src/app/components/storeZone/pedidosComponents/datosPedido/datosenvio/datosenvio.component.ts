import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild, inject, signal } from '@angular/core';
import { MY_STORAGESERVICES_TOKEN } from '../../../../../services/injectionTokenStorageService';
import { IStorageService } from '../../../../../models/IStorageService';
import { Observable, Subscription, tap } from 'rxjs';
import { ICliente } from '../../../../../models/cliente';
import { IDireccion } from '../../../../../models/direccion';
import { IMunicipio } from '../../../../../models/municipio';
import { IProvincia } from '../../../../../models/provincia';
import { RESTnodeService } from '../../../../../services/restnode.service';
import { IDatosPedido } from '../../../../../models/datospedido';

@Component({
  selector: 'app-datosenvio',
  templateUrl: './datosenvio.component.html',
  styleUrl: './datosenvio.component.css'
})
export class DatosenvioComponent implements OnDestroy{

  @Input() orderdata! : IDatosPedido;
  @Input() provinciasList!: IProvincia[];   
  @Output() orderdataChange = new EventEmitter<IDatosPedido>();
  @Output() checkBillEvent : EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild ('selectmunis') selectmunis ! : ElementRef;

  //public clientData$! : Observable<ICliente>;
  public clientData! : ICliente | null;
  private clientDataSubscriptor! : Subscription;
  public municipiosList$! : Observable<IMunicipio[]>;

  public mainAddr : IDireccion | undefined;
  private _initAddr : IDireccion = {
    idDireccion : window.crypto.randomUUID(),
    calle : '',
    pais : 'España',
    cp : 0,
    provincia :{CCOM : '', PRO:'',CPRO:''},
    municipio : {CUN : '',CMUM : '', CPRO : '', DMUN50 : ''},
    esPrincipal : false,
    esFacturacion : false
  }


  //*variables-tipo-switch para ocultar/mostrar partes de la vista 
  public mainAddrChecked : boolean = true;
  public loggedClientDelivChecked : boolean = true;
  

  constructor(@Inject(MY_STORAGESERVICES_TOKEN) private storageSvc : IStorageService, private restSvc : RESTnodeService,
  private render2 : Renderer2){
    
    this.clientDataSubscriptor=  this.storageSvc
                                      .RetrieveClientData()
                                      .subscribe(data => {
                                                                          this.clientData = data; 
                                                                          this.mainAddr = this.clientData?.direcciones?.filter((d:IDireccion) => d.esPrincipal === true)[0]
                                                                        }
                                                );

  }

  
  LoadMunicipios(selectedProv : string){ // <-- cpro-nombreprovincia
  console.log("CODIGO DE PROVI: ", selectedProv)
   this.municipiosList$ = this.restSvc.retrieveMunicipios(selectedProv.split('-')[0]); 
   this.render2.removeAttribute(this.selectmunis.nativeElement, 'disabled');
   this.orderdata.direccionEnvio!.provincia={CCOM:'', CPRO: selectedProv.split('-')[0], PRO: selectedProv.split('-')[1] }
  }
  setMunicipioSelect(muniselect : string){
   this.orderdata.direccionEnvio!.municipio = {CUN : '', CPRO : this.orderdata.direccionEnvio!.provincia.CPRO, CMUM : muniselect.split('-')[0], DMUN50 : muniselect.split('-')[1]} 
  }

  ShowDatosFacturaComponent(ev : any){
    this.checkBillEvent.emit(ev.target.checked);
  }

  CheckMainAddr(checked : boolean){
    this.mainAddrChecked = checked;
    if(checked){
      this.orderdata.tipoDireccion = 'principal';
      if(this.mainAddr !== undefined) this.orderdata.direccionEnvio = this.mainAddr;
    }else{
      this.orderdata.tipoDireccion = 'nueva';
      this.orderdata.direccionEnvio = this._initAddr;
    }
    this.orderdataChange.emit(this.orderdata);
  }

  CheckLoggedClientForDelivery(checked : boolean){
    this.loggedClientDelivChecked = checked;    
    if(checked){
      this.orderdata.nombreEnvio =  this.clientData!.nombre;
      this.orderdata.apellidosEnvio = this.clientData!.apellidos;
      this.orderdata.emailEnvio = this.clientData!.cuenta.email;
      this.orderdata.telefonoEnvio = this.clientData!.telefono;
    }

    this.orderdataChange.emit(this.orderdata);

  }


  ngOnDestroy() : void{
    this.clientDataSubscriptor.unsubscribe();
  }

}
