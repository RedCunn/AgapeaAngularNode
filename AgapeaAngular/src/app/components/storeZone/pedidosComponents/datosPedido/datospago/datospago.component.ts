import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDatosPedido } from '../../../../../models/datospedido';

@Component({
  selector: 'app-datospago',
  templateUrl: './datospago.component.html',
  styleUrl: './datospago.component.css'
})
export class DatospagoComponent {

  @Input () orderdata! : IDatosPedido;
  @Input() title : string = "2. - Datos Pago";
  @Output() orderdataChange = new EventEmitter<IDatosPedido>();

  months : number[] = Array.from({length : 12}, (el, pos)=>pos+1);
  years : number[] = Array.from({length : 10}, (el,pos)=>new Date(Date.now()).getFullYear() + pos);
  checkedtarjeta : boolean = true;

  constructor(){}
  
  CheckTarjeta(checked : boolean){
    this.checkedtarjeta = checked;
    if(checked){
      this.orderdata.metodoPago = 'tarjeta'
      this.orderdata.numeroTarjeta = ''
      this.orderdata.cvv = 0
      this.orderdata.anioCaducidad = 0
      this.orderdata.mesCaducidad = 0
      this.orderdata.banco = ''
    }else{
      this.orderdata.metodoPago = 'paypal'
    }
    this.orderdataChange.emit(this.orderdata);
  }
}
