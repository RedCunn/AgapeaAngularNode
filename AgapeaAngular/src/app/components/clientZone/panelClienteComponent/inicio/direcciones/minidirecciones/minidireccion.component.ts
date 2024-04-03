import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDireccion } from '../../../../../../models/direccion';

@Component({
  selector: 'app-minidireccion',
  templateUrl: './minidireccion.component.html',
  styleUrl: './minidireccion.component.css'
})
export class MinidireccionComponent {
  @Input() addressEdit! : IDireccion;
  @Output() operateAddressEvent : EventEmitter<[IDireccion, string]> = new EventEmitter<[IDireccion, string]>();
  constructor(){}

  OperateAddress(operation : string){
    this.operateAddressEvent.emit([this.addressEdit, operation]);
  }

}
