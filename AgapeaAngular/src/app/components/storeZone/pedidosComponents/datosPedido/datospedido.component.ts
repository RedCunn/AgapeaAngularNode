import { Component, Inject, Input, OnDestroy, OnInit, effect, signal } from '@angular/core';
import { Observable, Subscription, map, mergeMap, take, tap } from 'rxjs';
import { ILibro } from '../../../../models/libro';
import { IPedido } from '../../../../models/pedido';
import { IProvincia } from '../../../../models/provincia';
import { RESTnodeService } from '../../../../services/restnode.service';
import { IStorageService } from '../../../../models/IStorageService';
import { MY_STORAGESERVICES_TOKEN } from '../../../../services/injectionTokenStorageService';
import { OrderformService } from '../../../../services/orderform.service';
import { IDatosPedido } from '../../../../models/datospedido';
import { ICliente } from '../../../../models/cliente';
import { IDireccion } from '../../../../models/direccion';


@Component({
  selector: 'app-datospedido',
  templateUrl: './datospedido.component.html',
  styleUrl: './datospedido.component.css'
})
export class DatospedidoComponent {
  @Input() clienteLogg! : ICliente | null;
  public provinciasList$!: Observable<IProvincia[]>;
  public itemsList$ !: Observable<Array<{ libroElemento: ILibro, cantidadElemento: number }>>;
  public checkBill: boolean = false;
  public DatosPedido : IDatosPedido = {
    direccionEnvio : {
      idDireccion : window.crypto.randomUUID(), 
      calle : '',
      cp : 0,
      pais : 'España',
      provincia : {
        CCOM : '',
        CPRO : '',
        PRO : ''
      },
      municipio :{
        CMUM : '',
        CUN : '',
        CPRO : '',
        DMUN50 : ''
      },
      esFacturacion : false,
      esPrincipal : true
    },
    nombreEnvio : this.clienteLogg?.nombre || '',
    apellidosEnvio : this.clienteLogg?.apellidos || '',
    emailEnvio : this.clienteLogg?.cuenta.email || '',
    telefonoEnvio : this.clienteLogg?.telefono || '',
    tipoDireccion: 'principal', 
    tipoFactura: 'empresa', 
    tipoDireccionFacturacion: 'envio', 
    metodoPago: 'tarjeta' };
  

  constructor(@Inject(MY_STORAGESERVICES_TOKEN) private storageSvc: IStorageService, private restSvc: RESTnodeService, private orderFormSvc: OrderformService) {
    this.itemsList$ = this.storageSvc.RetrieveOrderItems();
    this.provinciasList$ = this.restSvc.retrieveProvincias();
  }

  ShowBillComponent(checked: boolean) {
    this.checkBill = checked;
  }

  onOrderDataChange(newData : IDatosPedido){
    this.DatosPedido = newData;
  }

  CompletOrder() {

    console.log('Finalizando pedido......');
    let _currentOrder: IPedido = {
      idCliente : '',
      idPedido: window.crypto.randomUUID(),
      fechaPedido: new Date(Date.now()),
      estadoPedido: 'pendiente de pago',
      elementosPedido: [],
      subTotalPedido: 0,
      gastosEnvio: 3,
      totalPedido: 0,
      datosPedido: this.DatosPedido
    }

    let sessiontoken! : string ;
    this.storageSvc.RetrieveJWT()
                  .pipe(
                    take(1)
                  )
                  .subscribe(jwt => {
                    sessiontoken = jwt;
                  });
    
    this.itemsList$.pipe(
      mergeMap(
        (items: Array<{ libroElemento: ILibro, cantidadElemento: number }>) => {
          _currentOrder.elementosPedido = items;

          let _subtotal = items.reduce((s, i) => s + (i.libroElemento.Precio * i.cantidadElemento), 0);
          _currentOrder.subTotalPedido = _subtotal;
          _currentOrder.totalPedido = _subtotal + 3;

          console.log('Pedido:', _currentOrder);


          return this.storageSvc.RetrieveClientData() as Observable<ICliente>;
        }
      )
    ).subscribe(
      async client => {
        console.log('datos a mandar a server...', { pedido: _currentOrder, email: client!.cuenta.email });
        let _resp = await this.restSvc.CompleteOrder(_currentOrder, client!.cuenta.email, sessiontoken);
        if(_resp.code === 0){
          console.log('urlObject:',_resp.others);
          window.location.href=_resp.others;
        }
        
      }
    )

  }

}
