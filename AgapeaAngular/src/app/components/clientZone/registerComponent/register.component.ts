import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { compareToValidator } from '../../../validators/compareTo';
import { RESTnodeService } from '../../../services/restnode.service';
import { IRestMessage } from '../../../models/restmessage';
import { ICliente } from '../../../models/cliente';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  
  public myForm:FormGroup;

  constructor(private restService : RESTnodeService, private router : Router){
    this.myForm= new FormGroup(
      {
        name : new FormControl('',[Validators.required, Validators.minLength(3),Validators.maxLength(50)]),
        lastname : new FormControl('',[Validators.required, Validators.minLength(3),Validators.maxLength(50)]),
        email : new FormControl('',[Validators.required, Validators.email]), // ++ validador asyn que compruebe que no existe email ya registrado
        repemail : new FormControl('',[Validators.required, Validators.email, compareToValidator('email')]), 
        password : new FormControl('',[Validators.required, Validators.minLength(8), Validators.maxLength(30)]),
        reppassword : new FormControl('',[Validators.required, compareToValidator('password')]),
        phone : new FormControl('',[Validators.minLength(9), Validators.maxLength(9)]),
        login: new FormControl('',[Validators.minLength(3), Validators.maxLength(20)])
      }
    )
  }

  async signupClient(){
    console.log("Form Status:", this.myForm.status);
    Object.keys(this.myForm.controls).forEach(key => {
      const control = this.myForm.get(key);
      console.log(`Control '${key}':`);
      console.log("  - Value:", control?.value);
      console.log("  - Valid:", control?.valid);
      console.log("  - Errors:", control?.errors);
    });
  
    if (this.myForm.status === 'VALID') {
        const cliente = {
          nombre: this.myForm.get('name')?.value,
          apellidos: this.myForm.get('lastname')?.value,
          cuenta : {
            email : this.myForm.get('email')?.value,
            password : this.myForm.get('password')?.value,
            login : this.myForm.get('login')?.value
          },
          telefono: this.myForm.get('phone')?.value
      };

      console.log("Cliente a registrar:", cliente);

      try {
        const response: IRestMessage = await this.restService.signupClient(cliente);  
        console.log("Respuesta del servidor al registro:", response);
        if(response.code === 0){
          this.router.navigateByUrl('/Cliente/RegistroOk');
        }
      } catch (error) {
        console.log("Error en el servidor al hacer registro:", error);
      }
      
      
    } else {
      console.error("Formulario inválido. Por favor, verifica los campos.");
      console.log("Errores en el formulario:", this.myForm.errors);
    }
  }

}
