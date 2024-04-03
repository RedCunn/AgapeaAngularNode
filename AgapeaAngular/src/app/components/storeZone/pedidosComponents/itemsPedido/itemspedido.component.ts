import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ILibro } from '../../../../models/libro';
import { MY_STORAGESERVICES_TOKEN } from '../../../../services/injectionTokenStorageService';
import { IStorageService } from '../../../../models/IStorageService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-itemspedido',
  templateUrl: './itemspedido.component.html',
  styleUrl: './itemspedido.component.css'
})
export class ItemspedidoComponent {

  @Input() public element!: {libroElemento : ILibro, cantidadElemento : number};
  @Output() public operateItemEvent : EventEmitter<[{libroElemento : ILibro, cantidadElemento : number}, string]> 
                                    = new EventEmitter<[{libroElemento : ILibro, cantidadElemento : number},string]>(); 
  
  constructor(@Inject(MY_STORAGESERVICES_TOKEN) private storageSvc : IStorageService) {}
  
  OperateItem(operation : string){
    this.operateItemEvent.emit([this.element, operation]);
  }

}
