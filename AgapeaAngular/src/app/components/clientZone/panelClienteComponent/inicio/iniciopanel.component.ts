import { Component, ElementRef, Inject, Input, Renderer2, ViewChild } from '@angular/core';
import { ICliente } from '../../../../models/cliente';
import { RESTnodeService } from '../../../../services/restnode.service';
import { MY_STORAGESERVICES_TOKEN } from '../../../../services/injectionTokenStorageService';
import { IStorageService } from '../../../../models/IStorageService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, concatMap, map, take } from 'rxjs';
import { IDireccion } from '../../../../models/direccion';
import { ModaldireccionComponent } from './direcciones/modaldireccion/modaldireccion.component';
import { IRestMessage } from '../../../../models/restmessage';

@Component({
  selector: 'app-iniciopanel',
  templateUrl: './iniciopanel.component.html',
  styleUrl: './iniciopanel.component.css'
})
export class IniciopanelComponent {

  days : number [] = Array.from({length: 31}, (el, pos)=>pos+1);
  months : string [] = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  years : number[] = Array.from({length : 110}, (el,pos)=>new Date(Date.now()).getFullYear() - pos);
  monthToString : string = '';
  
  public imgSrc:string="";
  public mensajesUpload:string="";
  private _fichImagen!: File;
  public datosClienteStorage$:Observable<ICliente|null>;
 
  public direcEditar:IDireccion={
        idDireccion:    '', //<--- mejor asi, para identificar si estamos creando o modificando direccion, si esta en blanco: creando direccion
        calle:          '',
        cp:             0,
        pais:           'España',
        provincia:       { CCOM: '', CPRO: '', PRO: ''},
        municipio:       { CUN: '', CPRO: '', CMUM: '', DMUN50: '' },
        esFacturacion:  false,
        esPrincipal:    false
  }

  @ViewChild('btnUploadImagen') btnUploadImagen!: ElementRef;
  
  public formDatosCuenta : FormGroup;


  constructor(private renderer2 : Renderer2, private restSvc : RESTnodeService, @Inject(MY_STORAGESERVICES_TOKEN) private storageSvc : IStorageService){
    
    this.datosClienteStorage$=this.storageSvc.RetrieveClientData() as Observable<ICliente|null>;

    this.formDatosCuenta = new FormGroup(
                                    {
                                    email: new FormControl({ value:'', disabled: true }, [Validators.required, Validators.email]),
                                    nombre: new FormControl( '', [Validators.required, Validators.maxLength(150)]),
                                    apellidos: new FormControl( '', [Validators.required, Validators.maxLength(250)]),
                                    telefono: new FormControl( '', [Validators.required, Validators.pattern('^[0-9]{3}\\s?([0-9]{2}\\s?){3}$')]),
                                    password: new FormControl('', [Validators.required, Validators.minLength(5),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$')]),
                                    repassword: new FormControl(''), // crear validador personalizado sincrono para comprobar si coincide con password
                                    genero: new FormControl(  ''),
                                    login: new FormControl(  '', [Validators.required]),
                                    dia: new FormControl( '0'),
                                    mes: new FormControl( '0'),
                                    anio: new FormControl('0'),
                                    descripcion: new FormControl('', [Validators.maxLength(500)])
                                    }
    ); //cierre formgroup formulario datos personales....

  //inicializamos el formulario con el ultimo valor del observable de datos del cliente...
  this.datosClienteStorage$.subscribe(
            (datoscliente:ICliente|null)=>{
                                    if(datoscliente){
                                      //clientCopy = datoscliente as ICliente
                                      //initialClient = JSON.parse(JSON.stringfy(datoscliente as ICliente))
                                      this.imgSrc=datoscliente.cuenta.imagenAvatarBASE64 || '';

                                      this.formDatosCuenta.controls['email'].setValue(datoscliente.cuenta.email);
                                      this.formDatosCuenta.controls['nombre'].setValue(datoscliente.nombre);
                                      this.formDatosCuenta.controls['apellidos'].setValue(datoscliente.apellidos);
                                      this.formDatosCuenta.controls['telefono'].setValue(datoscliente.telefono);
                                      this.formDatosCuenta.controls['genero'].setValue(datoscliente.genero);
                                      this.formDatosCuenta.controls['login'].setValue(datoscliente.cuenta.login);
                                      this.formDatosCuenta.controls['descripcion'].setValue(datoscliente.descripcion);

                                      if (datoscliente.fechaNacimiento){
                                        this.formDatosCuenta.controls['dia'].setValue(new Date(datoscliente.fechaNacimiento).getDay());
                                        this.formDatosCuenta.controls['mes'].setValue(new Date(datoscliente.fechaNacimiento).getMonth());
                                        this.formDatosCuenta.controls['anio'].setValue(new Date(datoscliente.fechaNacimiento).getFullYear());  
                                      }

                                    }
                  }
    );//cierre subscripcion observable cliente        

  }
  public PreviewImage(inputimg : any){
    this._fichImagen = inputimg.files[0] as File;
    let _lector: FileReader = new FileReader();

    _lector.addEventListener('load', ev => {
                                        console.log(ev.target!.result);

                                        this.imgSrc = ev.target!.result as string;
                                        this.renderer2.removeAttribute(this.btnUploadImagen.nativeElement, 'disabled');
    });

    _lector.readAsDataURL(this._fichImagen); 
  }
  
  public async UploadProfilePic(){

    (this.storageSvc.RetrieveClientData() as Observable<ICliente>)
    .pipe(
      take(1),
      concatMap( (_datoscliente:ICliente)=>{
            return this.restSvc.UploadImage(this.imgSrc, _datoscliente!.cuenta.email);
      })
    )
  .subscribe(
    (_resp:IRestMessage)=>{
      if (_resp.code==0) {
        //actualizamos datos del cliente logueado en el servicio storageservice y deshabilitamos el boton subir imagen de nuevo
        this.storageSvc.StoreClientData(_resp.clientdata!);
        this.renderer2.setAttribute(this.btnUploadImagen.nativeElement,'disabled','true');
        this.mensajesUpload=_resp.message;

    } else {
      //mostramos mensaje de error en vista...
      this.mensajesUpload=_resp.message + "..." + _resp.error;
    }
    }
  );



  }

  public UpdateDatosCuenta(){

  }

  
  
}
