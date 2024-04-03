import { Component, Inject, OnDestroy } from '@angular/core';
import { ILibro } from '../../../../models/libro';
import { Observable, Subscription } from 'rxjs';
import { RESTnodeService } from '../../../../services/restnode.service';
import { MY_STORAGESERVICES_TOKEN } from '../../../../services/injectionTokenStorageService';
import { IStorageService } from '../../../../models/IStorageService';
import { ICliente } from '../../../../models/cliente';


@Component({
  selector: 'app-mostrarpedido',
  templateUrl: './mostrarpedido.component.html',
  styleUrl: './mostrarpedido.component.css'
})
export class MostrarpedidoComponent implements OnDestroy {

  public itemsList$ !: Observable<{ libroElemento: ILibro, cantidadElemento: number }[]>;
  public clientData! : ICliente | null;
  private clientDataSubscriptor! : Subscription;

  constructor(@Inject(MY_STORAGESERVICES_TOKEN) private storageSvc: IStorageService, private restSvc : RESTnodeService) {
    this.itemsList$ = storageSvc.RetrieveOrderItems();

    
    this.clientDataSubscriptor=  this.storageSvc
                                      .RetrieveClientData()
                                      .subscribe(data => { this.clientData = data; } );
  }

  ModifyOrderItem(item: [{ libroElemento: ILibro, cantidadElemento: number }, string]) {

    let _book : ILibro = item[0].libroElemento;
    let _quant : number = item[0].cantidadElemento;

    switch (item[1]) {
      case 'add':
        ++_quant;
        break;
      case 'substract':
        --_quant;
        break;
      case 'remove':
        _quant = 0;
        break;
      default:
        break;
    }

    this.storageSvc.OperateOrderItems(_book, _quant,item[1] != 'remove' ? 'modify' : 'remove');
  }

  ngOnDestroy() : void{
    this.clientDataSubscriptor.unsubscribe();
  }

}
