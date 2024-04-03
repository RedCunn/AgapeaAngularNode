import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { IProvincia } from '../../../../../models/provincia';
import { Observable } from 'rxjs';
import { IMunicipio } from '../../../../../models/municipio';
import { RESTnodeService } from '../../../../../services/restnode.service';
import { IDatosPedido } from '../../../../../models/datospedido';

@Component({
  selector: 'app-datosfactura',
  templateUrl: './datosfactura.component.html',
  styleUrl: './datosfactura.component.css'
})
export class DatosfacturaComponent {

  @Input() orderdata! : IDatosPedido;
  @Input() provinciasList! : IProvincia[];
  @Output() orderdataChange = new EventEmitter<IDatosPedido>();
  @ViewChild('selectmunis') selectmunis! : ElementRef;

  public checkempresa : boolean = true;
  public checksameaddr : boolean = true;
  public municipiosList$! : Observable<IMunicipio[]>;

  constructor(private restSvc : RESTnodeService, private render2 : Renderer2){  }



  CheckTipoFacturaChange(checked : boolean){
    this.checkempresa = checked;

    if(this.checkempresa){
      this.orderdata.tipoFactura = 'empresa';
    }else{
      this.orderdata.tipoFactura = 'particular';
    }
    this.orderdataChange.emit(this.orderdata);
  }

  CheckSameAddressChange(checked : boolean){
    this.checksameaddr =! checked;

    if(this.checksameaddr){
      this.orderdata.direccionFactura = this.orderdata.direccionEnvio;
    }else{
      this.orderdata.direccionFactura = {
        idDireccion : window.crypto.randomUUID(),
        calle:        '',
        pais:         'España',
        cp:           0,
        provincia:    { CCOM:'', PRO:'', CPRO:''},
        municipio:    { CUN:'', CPRO:'', CMUM:'', DMUN50:''},
        esPrincipal:  false,
        esFacturacion: true,
      }
    }
    this.orderdataChange.emit(this.orderdata);

  }

  LoadMunicipios(selectedProv : string){
    this.municipiosList$ = this.restSvc.retrieveMunicipios(selectedProv.split('-')[0]); 
   this.render2.removeAttribute(this.selectmunis.nativeElement, 'disabled');
   this.orderdata.direccionEnvio!.provincia={CCOM:'', CPRO: selectedProv.split('-')[0], PRO: selectedProv.split('-')[1] }
   this.orderdataChange.emit(this.orderdata);
  }
  setMunicipioSelect(muniselect : string){
    this.orderdata.direccionEnvio!.municipio = {CUN : '', CPRO : this.orderdata.direccionEnvio!.provincia.CPRO, CMUM : muniselect.split('-')[0], DMUN50 : muniselect.split('-')[1]} 
    this.orderdataChange.emit(this.orderdata);
   }
}
