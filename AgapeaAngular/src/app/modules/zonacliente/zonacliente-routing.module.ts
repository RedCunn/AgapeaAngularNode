import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from '../../components/clientZone/registerComponent/register.component';
import { LoginComponent } from '../../components/clientZone/loginComponent/login.component';
import { RegistrookComponent } from '../../components/clientZone/registroOkComponent/registrook.component';
import { IniciopanelComponent } from '../../components/clientZone/panelClienteComponent/inicio/iniciopanel.component';
import { MiscomprasComponent } from '../../components/clientZone/panelClienteComponent/miscompras/miscompras.component';
import { MisopinionesComponent } from '../../components/clientZone/panelClienteComponent/misopiniones/misopiniones.component';

const routes: Routes = [
                            {path : 'Cliente',
                            children:
                            [
                              {path : 'Registro',component: RegisterComponent},
                              {path : 'Login',component: LoginComponent},
                              {path : 'RegistroOk', component : RegistrookComponent},
                              {path : 'Panel',
                              children :
                                [
                                  {path : 'Inicio', component: IniciopanelComponent},
                                  {path : 'MisCompras', component: MiscomprasComponent},
                                  {path : 'MisOpiniones', component: MisopinionesComponent}
                                ]
                              }
                            ]
                          }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZonaclienteRoutingModule { }
