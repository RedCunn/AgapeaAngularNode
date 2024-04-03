import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { RESTnodeService } from '../services/restnode.service';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, last, map, tap } from 'rxjs';
import { IRestMessage } from '../models/restmessage';

@Directive({
  selector: '[appCheckExistingEmail]',
  providers: [
    {provide: NG_ASYNC_VALIDATORS, useExisting: CheckExistingEmailDirective, multi: true}
  ]
})
export class CheckExistingEmailDirective implements AsyncValidator {

  constructor(private restSvc: RESTnodeService, private inputEmail: ElementRef, private render2: Renderer2) { }


  validate(control: AbstractControl<any, any>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {

    //tengo que transformar ese IRestMessage que recibo en un ValidationErrors ==> pipe()
    return this.restSvc.checkEmailExists(control.value)
    .pipe(
      //op1. tap() para mostrar el observable:
      tap((dato: IRestMessage) => console.log('el servidor en CheckExistingEmail ha devuelto esto : ', dato)),
      //op1. map() para transformar el observable:
      map((dato: IRestMessage) => { 
        
                        if(dato.code === 0){
                          this.render2.setAttribute(this.inputEmail.nativeElement, 'style', 'background-color: lightyellow');
                        }                
                        return dato.code === 0 ? null : { 'emailExists': false }
                      }
                ),
      //coge el último elemento del observable y lo cierra, nos interesa solo la parte de que lo cierre aqui:
      last()
    );
  }

}
