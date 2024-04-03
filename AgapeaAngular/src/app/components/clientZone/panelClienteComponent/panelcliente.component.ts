import { Component, Inject, OnDestroy, Renderer2 } from '@angular/core';
import { ICliente } from '../../../models/cliente';
import { Subscription, filter, last, map, switchMap, tap } from 'rxjs';
import { RESTnodeService } from '../../../services/restnode.service';
import { IStorageService } from '../../../models/IStorageService';
import { MY_STORAGESERVICES_TOKEN } from '../../../services/injectionTokenStorageService';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-panelcliente',
  templateUrl: './panelcliente.component.html',
  styleUrl: './panelcliente.component.css'
})
export class PanelclienteComponent implements OnDestroy{
  public clientData! : ICliente | null;
  private clientDataSubscriptor! : Subscription;
  currentRoute : string = '';
  constructor(@Inject(MY_STORAGESERVICES_TOKEN) private storageSvc : IStorageService, private restSvc : RESTnodeService, private router : Router){
    
    this.clientDataSubscriptor =  this.storageSvc
                                      .RetrieveClientData()
                                      .subscribe(data => { this.clientData = data; });
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  

  ngOnDestroy() : void{
    this.clientDataSubscriptor.unsubscribe();
  }


}
