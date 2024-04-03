import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundquantity'
})
export class RoundquantityPipe implements PipeTransform {
//pipe usada para redondeo de valores numericos, como arg tiene el numero de decimales q quieres , por defecto 2
  transform(value: number, decimals: number = 2): number {
    // si usas toFixed te devuelve string
    return Math.round(value * 10**decimals)/10**decimals;
  }

}
