import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { AbstractControl, NG_ASYNC_VALIDATORS, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

//!para usar directivas que actuen como validador en TEMPLATE-FORMS tienes que inyectarlas -> providers []  
@Directive({
  selector: '[appEmailfilterdomain]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: EmailfilterdomainDirective, multi: true } 
    // 1º param : le dice al modulo de inyeccion de deps. que esta directiva puede ser usada como validador SYNC
    // 2º param : la clase que vas a devolver 
    // 3º param : si pueden inyectarse multiples instancias de esta clase o no                                                           
  ]
})
export class EmailfilterdomainDirective implements Validator {
  @Input() validDomains: string[] = [];

  // 1º arg : referencia al elemento del DOM sobre el que se aplica la directiva de tipo ElementRef  
  //! 2º arg : inyecto Renderer2 <--- otorga props/methods para modificar elementos del DOM desde codigo
  constructor(private inputEmail: ElementRef, private render2: Renderer2) { } 

  // metodo que se ejecuta cada vez q el contenido del dom cambia (input email en este caso)
  // -> arg : control sobre el cual se aplica la directiva 
  // -> return : Obj ValidationErrors cuando mal {'clave-error' : 'error'} lo encontramos en .errors y null cuando OK
  validate(control: AbstractControl<any, any>): ValidationErrors | null {

    const _emailvalue = control.value as string;

    if(_emailvalue){
      if ( typeof _emailvalue === 'string' && _emailvalue.indexOf('@')) {
        let _findDomain = _emailvalue.split('@')[1].split('.')[0];
  
        if (this.validDomains.some(dom => dom === _findDomain)) {
          this.render2.setAttribute(this.inputEmail.nativeElement, 'style', 'background-color : lightgreen');
          return null;
        } else{
          this.render2.setAttribute(this.inputEmail.nativeElement, 'style', 'background-color : pink');
          return { 'emailfilterdoms': { 'message': 'dominio de email invalido', 'valid': this.validDomains } };
        }
      } else {
        return null;
      }
    }else{
      this.render2.setAttribute(this.inputEmail.nativeElement, 'style', 'background-color : white');
      return null;
    }
    
  }

}
