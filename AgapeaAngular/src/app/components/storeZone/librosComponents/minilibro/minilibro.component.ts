import { Component, Inject, Input } from '@angular/core';
import { ILibro } from '../../../../models/libro';
import { MY_STORAGESERVICES_TOKEN } from '../../../../services/injectionTokenStorageService';
import { IStorageService } from '../../../../models/IStorageService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-minilibro',
  templateUrl: './minilibro.component.html',
  styleUrl: './minilibro.component.css'
})
export class MinilibroComponent {

  @Input() showedBook!: ILibro;

  constructor(@Inject(MY_STORAGESERVICES_TOKEN) private storageSvc : IStorageService, private router : Router) {}
  
  AddBookToOrder(){
    this.storageSvc.OperateOrderItems(this.showedBook,1,'add');
    this.router.navigateByUrl('/Tienda/Pedido');
  }
}
