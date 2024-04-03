import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibrosComponent } from '../../components/storeZone/librosComponents/libreria/libros.component';
import { DetalleslibroComponent } from '../../components/storeZone/librosComponents/librodetalle/detalleslibro.component';
import { MostrarpedidoComponent } from '../../components/storeZone/pedidosComponents/mostrarPedido/mostrarpedido.component';

const routes: Routes = [
                          {path: 'Tienda', 
                          children:
                            [
                              {path: 'Libreria/:catid?', component: LibrosComponent},
                              {path: 'Libro/:isbn?', component : DetalleslibroComponent},
                              {path: 'Pedido', component: MostrarpedidoComponent}
                            ]
                          }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonatiendaRoutingModule { }
