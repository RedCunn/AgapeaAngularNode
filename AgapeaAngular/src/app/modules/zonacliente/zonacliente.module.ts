import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZonaclienteRoutingModule } from './zonacliente-routing.module';

//*----------MODULOS SECUNDARIOS-------------------------------
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//*------------COMPONENTES--------------------------------------
import { RegisterComponent } from '../../components/clientZone/registerComponent/register.component';
import { LoginComponent } from '../../components/clientZone/loginComponent/login.component';
import { RegistrookComponent } from '../../components/clientZone/registroOkComponent/registrook.component';
// *------------ DIRECTIVES ---------------
import { EmailfilterdomainDirective } from '../../directives/emailfilterdomain.directive';
import { CheckExistingEmailDirective } from '../../directives/check-existing-email.directive';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    BrowserAnimationsModule,
    ZonaclienteRoutingModule
  ]
})
export class ZonaclienteModule { }
