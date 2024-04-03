import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibrosComponent } from './components/storeZone/librosComponents/libreria/libros.component';
import { DetalleslibroComponent } from './components/storeZone/librosComponents/librodetalle/detalleslibro.component';
import { MostrarpedidoComponent } from './components/storeZone/pedidosComponents/mostrarPedido/mostrarpedido.component';
import { RegisterComponent } from './components/clientZone/registerComponent/register.component';
import { LoginComponent } from './components/clientZone/loginComponent/login.component';
import { RegistrookComponent } from './components/clientZone/registroOkComponent/registrook.component';
import { IniciopanelComponent } from './components/clientZone/panelClienteComponent/inicio/iniciopanel.component';
import { MiscomprasComponent } from './components/clientZone/panelClienteComponent/miscompras/miscompras.component';
import { MisopinionesComponent } from './components/clientZone/panelClienteComponent/misopiniones/misopiniones.component';
import { PanelclienteComponent } from './components/clientZone/panelClienteComponent/panelcliente.component';
import { PedidocompletadoOKComponent } from './components/storeZone/pedidosComponents/pedidocompletado/pedidocompletado-ok.component';
//modulo principal de enrutamiento usado por el modulo global de la aplicacion app.module.ts
//necesitan tener definidos un array de objetos de tipo INTERFAZ Route
//loadChildren : ()=> import('./modules/zonacliente/zonacliente.module').then(m => m.ZonaclienteModule)
//loadChildren : () => import('./modules/zonatienda/zonatienda.module').then(m=> m.ZonatiendaModule)
const routes: Routes = [
  {path : 'Cliente',
  children:
  [
    {path : 'Registro',component: RegisterComponent},
    {path : 'Login',component: LoginComponent},
    {path : 'RegistroOk', component : RegistrookComponent},
    {path : 'Panel', component : PanelclienteComponent,
    children :
      [
        {path : 'Inicio', component: IniciopanelComponent},
        {path : 'MisCompras', component: MiscomprasComponent},
        {path : 'MisOpiniones', component: MisopinionesComponent}
      ]
    }
  ]
  },
  {path: 'Tienda', 
  children:
  [
    {path: 'Libreria/:catid?', component: LibrosComponent},
    {path: 'Libro/:isbn?', component : DetalleslibroComponent},
    {path: 'Pedido', component: MostrarpedidoComponent,
    children : 
    [
      {path: 'PedidoFinalizado', component : PedidocompletadoOKComponent}
    ]
    }
  ]
  },
  {path:'', redirectTo:'Tienda/Libreria/2-10',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
