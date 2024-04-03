import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZonatiendaRoutingModule } from './zonatienda-routing.module';
//*----------MODULOS SECUNDARIOS-------------------------------
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//*------------COMPONENTES--------------------------------------
import { MostrarpedidoComponent } from '../../components/storeZone/pedidosComponents/mostrarPedido/mostrarpedido.component';
import { ItemspedidoComponent } from '../../components/storeZone/pedidosComponents/itemsPedido/itemspedido.component';
import { DatospedidoComponent } from '../../components/storeZone/pedidosComponents/datosPedido/datospedido.component';
import { DatosenvioComponent } from '../../components/storeZone/pedidosComponents/datosPedido/datosenvio/datosenvio.component';
import {DatosfacturaComponent} from '../../components/storeZone/pedidosComponents/datosPedido/datosfactura/datosfactura.component';
import { DatospagoComponent } from '../../components/storeZone/pedidosComponents/datosPedido/datospago/datospago.component';
// *------------ PIPES ---------------
import { RoundquantityPipe } from '../../pipes/roundquantity.pipe';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ZonatiendaRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    BrowserAnimationsModule
  ]
})
export class ZonatiendaModule { }
