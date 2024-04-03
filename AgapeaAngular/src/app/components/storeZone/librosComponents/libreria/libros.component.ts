import { Component } from '@angular/core';
import { ILibro } from '../../../../models/libro';
import { RESTnodeService } from '../../../../services/restnode.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, concatMap, tap } from 'rxjs';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.css'
})
export class LibrosComponent {
  //public booksList : ILibro[] = []; // ? <-- esto no lo quiero , quiero usar directamente el observable ILibro[] que me da el servicio...
  public booksList$ ! : Observable<ILibro[]>;

  constructor (private restSvc : RESTnodeService, private actRoute : ActivatedRoute){

    //----- CON OPERADOR concatMap PARA EVITAR NESTED-SUBSCRIBRES

    this.booksList$ = this.actRoute
                          .paramMap
                          .pipe(
                                concatMap( (param:ParamMap)=>  { return this.restSvc.booksByCategory(param.get('catid') || '') } ) 
                                );


    //#region --------- CON SUSCRIPCIONES NORMALES -----------
    // recuperamos de la url el segmento donde va la catid
    // *como es un solo segmento usamos parammap, si fuesen varios lo haria con queryparammap
    // this.actRoute
    //     .paramMap
    //     .subscribe((param : ParamMap) =>{
                                            //   let _catid = param.get('catid') || '2-10';
                                            //   this.restSvc.booksByCategory(_catid).subscribe( (data : ILibro[]) => this.booksList = data)
                                          //});
    //#endregion

  }
}
