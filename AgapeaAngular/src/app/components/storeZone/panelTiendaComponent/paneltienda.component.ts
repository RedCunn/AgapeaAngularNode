import { Component } from '@angular/core';
import { ICategoria } from '../../../models/categoria';
import { RESTnodeService } from '../../../services/restnode.service';
import { Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-paneltienda',
  templateUrl: './paneltienda.component.html',
  styleUrl: './paneltienda.component.css'
})
export class PaneltiendaComponent {

  public rootCategorie$! : Observable<ICategoria[]>;

  constructor(private restSvc : RESTnodeService, private router : Router) {
    this.rootCategorie$ = restSvc.retrieveCategories('root');
  }

  public GoToCategory (ev : Event , cat : ICategoria){
    this.router.navigateByUrl(`/Tienda/Libreria/${cat.IdCategoria}`);
  }

  
}
