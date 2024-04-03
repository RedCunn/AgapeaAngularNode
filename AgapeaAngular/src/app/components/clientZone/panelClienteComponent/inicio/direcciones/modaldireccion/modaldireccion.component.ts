import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, Signal, ViewChild } from '@angular/core';
import { IDireccion } from '../../../../../../models/direccion';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IProvincia } from '../../../../../../models/provincia';
import { IMunicipio } from '../../../../../../models/municipio';
import { Observable } from 'rxjs';
import { RESTnodeService } from '../../../../../../services/restnode.service';

@Component({
  selector: 'app-modaldireccion',
  templateUrl: './modaldireccion.component.html',
  styleUrl: './modaldireccion.component.css'
})

export class ModaldireccionComponent {

  @Input() isOpen : boolean = false;
  @Output() close = new EventEmitter<void>();
  
  private _value! : IDireccion ;
  // //*tambien podría hacer toda esta operacion en el ngOnChanges
  @Input () set addressEd (value : IDireccion) {
    console.log('tamos en el SET del param input cambiando su valor')
    if(value!.calle === '' && value!.cp === 0){
      this.operation = 'create'
      // reseteo form
      this.addressForm.reset();
    }else{
      this.operation = 'modify'
      //precargamos las cajas del formulario con los valores de la direccion pasada como param
      this.preLoadAddressDataToModify();
    }
    this._value = value;
  }
  get addressEd() : IDireccion{
    return this._value;
  }
  //*con INPUT-SIGNALS ::

  
  public listaprovincias$!:Observable<Array<IProvincia>>;
  public listamunicipios$!:Observable<Array<IMunicipio>>;
  @ViewChild('selectmunis') selectmunis!:ElementRef;
  @Output() modifcrearDirecEvent:EventEmitter<[IDireccion,string]>=new EventEmitter<[IDireccion,string]>();

  public operation : string = 'create'
  public addressForm! : FormGroup;


  constructor (private restSvc:RESTnodeService, private renderer2: Renderer2){
    this.listaprovincias$ = restSvc.retrieveProvincias();

    this.addressForm = new FormGroup ({
                                                    calle:new FormControl('',[Validators.required]),
                                                    cp: new FormControl('',[Validators.required, Validators.pattern('^[0-9]{5}$')]),
                                                    pais: new FormControl( 'España'),
                                                    provincia: new FormControl(),
                                                    municipio: new FormControl()
                                                }
                                      )
  }

  public  CargarMunicipios( provSelec:string){ //<--- va: "cpro - nombre provincia"
    //this.selectmunis.nativeElement.innerHTML='';
    this.listamunicipios$=this.restSvc.retrieveMunicipios(provSelec.split('-')[0]);
    this.renderer2.removeAttribute(this.selectmunis.nativeElement, 'disabled');
  }

  closeModal(){
    this.close.emit();
  }

  private preLoadAddressDataToModify(){
    this.addressForm.controls['calle'].setValue(this.addressEd!.calle);
    this.addressForm.controls['cp'].setValue(this.addressEd!.cp);
    this.addressForm.controls['pais'].setValue(this.addressEd!.pais);
    this.addressForm.controls['provincia'].setValue(this.addressEd!.provincia.CPRO + '-' + this.addressEd!.provincia.PRO);
    this.CargarMunicipios(this.addressEd!.provincia.CPRO);

    //dejo un poco de tiempo para q se carguen los municipios...
    setTimeout( 
      ()=> this.addressForm.controls['municipio'].setValue(this.addressEd!.municipio.CMUM + '-' + this.addressEd!.municipio.DMUN50),
      1000
    );
  }

  public OperateAddress(){
    let { provincia, municipio, calle, cp, pais }=this.addressForm.value;
      
      let _datosdirec:IDireccion = {
        idDireccion: this.operation=='create' ? window.crypto.randomUUID() : this.addressEd!.idDireccion,
        calle,
        cp,
        pais,
        provincia: { CCOM:'', CPRO: provincia.split('-')[0], PRO:provincia.split('-')[1] },
        municipio: { CPRO: provincia.split('-')[0], CMUM: municipio.split('-')[0], DMUN50:municipio.split('-')[1], CUN:'' },
        esPrincipal:false,
        esFacturacion:false
      }
      
      if(this.operation=='modify') this.operation='modify-ended';
      this.modifcrearDirecEvent.emit( [_datosdirec, this.operation ]);

      //tras alta o modificacion, ocultamos modal..y reseteamos form
      this.operation='create';
      this.addressForm.reset();

      this.close.emit();
  }
}
