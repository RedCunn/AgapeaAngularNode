import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { onlyNumbersValidator } from '../validators/onlyNumbers';

@Injectable({
  providedIn: 'root'
})
export class OrderformService {
  private shippingGroup : FormGroup;
  private billGroup : FormGroup;
  private paymentGroup : FormGroup;
  constructor(){

    this.shippingGroup = new FormGroup ({
      personaEnvio: new FormGroup({
        nombre: new FormControl ('', [Validators.required]),
        apellidos: new FormControl ('', [Validators.required]),
        email: new FormControl ('', [Validators.required, Validators.email]),
        telefonoContacto: new FormControl('', [Validators.required, onlyNumbersValidator()]),
      }),
      telefonoContacto: new FormControl('', [Validators.required, onlyNumbersValidator()]),
      direccionEnvio: new FormGroup({
        pais: new FormControl ('', [Validators.required]),
        calle: new FormControl ('', [Validators.required]),
        provincia: new FormControl ('', [Validators.required]),
        municipio: new FormControl ('', [Validators.required]),
        cp: new FormControl('', [Validators.required, onlyNumbersValidator()])
      }),
      otrosDatos: new FormControl('')
    });

    this.billGroup = new FormGroup ({
      tipoFactura : new FormControl('empresa'),
      titular: new FormControl ('', [Validators.required]),
      docIdentificacion: new FormControl ('', [Validators.required]),
      direccionFactura: new FormGroup({
        pais: new FormControl ('', [Validators.required]),
        calle: new FormControl ('', [Validators.required]),
        provincia: new FormControl ('', [Validators.required]),
        municipio: new FormControl ('', [Validators.required]),
        cp: new FormControl('', [Validators.required, onlyNumbersValidator(), Validators.minLength(5), Validators.maxLength(5)])
      })
    });

    this.paymentGroup = new FormGroup ({
      metodoPago : new FormControl ('tarjeta'),
      datosTarjeta: new FormGroup({
        numeroTarjeta: new FormControl('', [Validators.required, onlyNumbersValidator()]),
        nombreBanco: new FormControl(''),
        mesCaducidad:new FormControl ('', [Validators.required]),
        anioCaducidad: new FormControl ('', [Validators.required]),
        cvv: new FormControl('', [Validators.required, onlyNumbersValidator(), Validators.minLength(3), Validators.maxLength(3)])
      })
    });

  }

  getPaymentGroup() : FormGroup {
    return this.paymentGroup;
  }

  getShippingGroup() : FormGroup {
    return this.shippingGroup;
  }

  getBillGroup() : FormGroup {
    return this.billGroup;
  }

  disablePersonaEnvio (check : boolean){
    
    check ? this.shippingGroup.get('personaEnvio')?.enable() : this.shippingGroup.get('personaEnvio')?.disable();

  }

  disableDireccionEnvio(check : boolean){
    
    check ?this.shippingGroup.get('direccionEnvio')?.enable() : this.shippingGroup.get('direccionEnvio')?.disable();

  }

  disableFactura(check : boolean){
    check ? this.billGroup.enable() : this.billGroup.disable();
  }

  disableDireccionFactura(check : boolean){
    
    check ?this.billGroup.get('direccionFactura')?.enable() : this.billGroup.get('direccionFactura')?.disable();

  }
 
  disableDatosTarjeta (check : boolean){
    
    check ?this.paymentGroup.get('datosTarjeta')?.enable() : this.paymentGroup.get('datosTarjeta')?.disable();

  }
}
