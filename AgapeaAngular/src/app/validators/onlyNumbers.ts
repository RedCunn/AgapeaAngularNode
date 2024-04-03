//validador sync para comprobar que solo se metan numeros no caracteres 

import {AbstractControl, ValidatorFn} from '@angular/forms';

export function onlyNumbersValidator():ValidatorFn{
    
    return (control:AbstractControl):{[key: string]: boolean} | null =>{
        
        //tengo que recuperar el valor del campo del form (FormControl) con nombre: nombreControl 
        const controlValue:string = control.value;
        const pattern = /^\d+$/;

        if(pattern.test(controlValue)){
            return null;
        }else{
            return {'onlyNumbers':false};
        }
    };
};
