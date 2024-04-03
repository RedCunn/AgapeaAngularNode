import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// *------------ MODULOS SECUNDARIOS : BRANCHES DEL MODULO PRINCIPAL DE LA APP ---------------
   //AppRoutingModule : modulos encargado de detectar variacion de url en el browser, y en funcion de su config.file :  
  //app-routing.module.ts , carga un componente u otro
import { AppRoutingModule } from './app-routing.module';
   //HttpClientModule : modulo encargado de dar inyeccion de servicios comunes para hacer pet.HTTP externas
  //usando servicio HttpClient (tambien permite definicion de INTERCEPTORS)
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
   //ReactiveFormsModule : modulo donde se definen directivas a usar en vistas de componentes para mapear obj FormGroup y FormControl 
  //contra elementos del dom (directivas formGroup y formControlName)
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// *------------ COMPONENTS ---------------
import { AppComponent } from './app.component';
import { PaneltiendaComponent } from './components/storeZone/panelTiendaComponent/paneltienda.component';
import { PanelclienteComponent } from './components/clientZone/panelClienteComponent/panelcliente.component';
import { IniciopanelComponent } from './components/clientZone/panelClienteComponent/inicio/iniciopanel.component';
import { MiscomprasComponent } from './components/clientZone/panelClienteComponent/miscompras/miscompras.component';
import { MisopinionesComponent } from './components/clientZone/panelClienteComponent/misopiniones/misopiniones.component';
import { DireccionesComponent } from './components/clientZone/panelClienteComponent/inicio/direcciones/direcciones.component';
import { ModaldireccionComponent } from './components/clientZone/panelClienteComponent/inicio/direcciones/modaldireccion/modaldireccion.component';
import { LibrosComponent } from './components/storeZone/librosComponents/libreria/libros.component';
import { DetalleslibroComponent } from './components/storeZone/librosComponents/librodetalle/detalleslibro.component';
import { MinilibroComponent } from './components/storeZone/librosComponents/minilibro/minilibro.component';
import { MostrarpedidoComponent } from './components/storeZone/pedidosComponents/mostrarPedido/mostrarpedido.component';
import { ItemspedidoComponent } from './components/storeZone/pedidosComponents/itemsPedido/itemspedido.component';
import { DatospedidoComponent } from './components/storeZone/pedidosComponents/datosPedido/datospedido.component';
import { DatosenvioComponent } from './components/storeZone/pedidosComponents/datosPedido/datosenvio/datosenvio.component';
import {DatosfacturaComponent} from './components/storeZone/pedidosComponents/datosPedido/datosfactura/datosfactura.component';
import { DatospagoComponent } from './components/storeZone/pedidosComponents/datosPedido/datospago/datospago.component';
import { RegisterComponent } from './components/clientZone/registerComponent/register.component';
import { LoginComponent } from './components/clientZone/loginComponent/login.component';
import { RegistrookComponent } from './components/clientZone/registroOkComponent/registrook.component';
// *------------ DIRECTIVES ---------------
import { EmailfilterdomainDirective } from './directives/emailfilterdomain.directive';
import { CheckExistingEmailDirective } from './directives/check-existing-email.directive';

// *------------ PIPES ---------------
import { RoundquantityPipe } from './pipes/roundquantity.pipe';
// *------------ SERVICES ---------------
import {RESTnodeService} from '../app/services/restnode.service';
import { MY_STORAGESERVICES_TOKEN } from './services/injectionTokenStorageService';
import { SubjectstorageService } from './services/subjectstorage.service';
import { AuthjwtInterceptor } from './services/INTERCEPTORS/authjwt.interceptor';
import { MinidireccionComponent } from './components/clientZone/panelClienteComponent/inicio/direcciones/minidirecciones/minidireccion.component';
import { PedidocompletadoOKComponent } from './components/storeZone/pedidosComponents/pedidocompletado/pedidocompletado-ok.component';
//*--------------MODULES----------------------------------------------------------
// import { ZonaclienteModule } from './modules/zonacliente/zonacliente.module';
// import { ZonatiendaModule } from './modules/zonatienda/zonatienda.module';


@NgModule({
  declarations: [ //array con definiciones de components, directives y pipes disponibles para toda la app
    AppComponent,
    PaneltiendaComponent,
    PanelclienteComponent,
    IniciopanelComponent,
    MiscomprasComponent,
    MisopinionesComponent,
    DireccionesComponent,
    ModaldireccionComponent,
    LibrosComponent,
    DetalleslibroComponent,
    MinilibroComponent,
    RoundquantityPipe,
    MostrarpedidoComponent,
    ItemspedidoComponent,
    DatospedidoComponent,
    DatosenvioComponent,
    DatospagoComponent,
    DatosfacturaComponent,
    RegisterComponent,
    LoginComponent,
    RegistrookComponent,
    EmailfilterdomainDirective,
    CheckExistingEmailDirective,
    MinidireccionComponent,
    PedidocompletadoOKComponent,
  ],
  imports: [ // array con las definiciones de los modulos secundarios que tu app va a usar 
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule
  ],
  providers: [ //array para definir la inyeccion de dependencias de servicios usados por componentes
    RESTnodeService, // --> es como si pusiera : {provide : RESTnodeService, useClass : RESTnodeService}
                   //significa que cuando un componente me pida la clase del 1º param provide, usara la clase que yo le ponga en 2º param
                   
                   /* podrías devolver también : 
                      -> valor constante : 
                        {provide : RESTnodeService, useValue : 'hola guapi'} 
                      -> funcion :
                        {provide : RESTnodeService, useFactory : () => {
                          const localStorageValues = Object.keys(localStorage)
                                                    .filter(key => localStorage[key]?.includes('@'))
                                                    .reduce((acc, key) => ({ ...acc, [key]: localStorage[key] }), {});
                          const restNodeService = new RESTnodeService();
                          restNodeService.setDatos(localStorageValues); // Ajusta según el método de tu servicio para configurar datos
                          
                          return restNodeService;
                      }} 
                   */ 
    {provide : MY_STORAGESERVICES_TOKEN, useClass : SubjectstorageService},
    {provide : HTTP_INTERCEPTORS , useClass : AuthjwtInterceptor, multi : true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
