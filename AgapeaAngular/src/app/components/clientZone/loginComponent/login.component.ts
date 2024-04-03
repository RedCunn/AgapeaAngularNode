import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router} from "@angular/router";
import { RESTnodeService } from '../../../services/restnode.service';
import { IRestMessage } from '../../../models/restmessage';
import { MY_STORAGESERVICES_TOKEN } from '../../../services/injectionTokenStorageService';
import { IStorageService } from '../../../models/IStorageService';
import { ICliente } from '../../../models/cliente';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  public credentials : {email : String, password : String} = {email : '', password : ''};
  public loginServerErrors : String = "";

  constructor (private router : Router,
               private restService : RESTnodeService,
               @Inject(MY_STORAGESERVICES_TOKEN) private storageSvc : IStorageService){}

  goToSignup(){
    this.router.navigateByUrl('/Cliente/Registro');
  }

  async LoginClient( loginForm : NgForm){
    const _response:IRestMessage = await this.restService.loginClient(loginForm.form.value);
    if(_response.code === 0){
      
      this.storageSvc.StoreClientData( _response.clientdata!);
      this.storageSvc.StoreJWT(_response.token!);
      this.router.navigateByUrl('/Tienda/Libreria/2-10');
    }else{
      this.loginServerErrors = _response.error!;
    }
    
  }
}
