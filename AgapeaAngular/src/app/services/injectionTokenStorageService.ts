import { InjectionToken } from "@angular/core";
import { IStorageService } from "../models/IStorageService";

// el string del constructor InjectionToken es la "clave" con la que se van a identificar en el modulo de DI 
// los servicios q implementan la interface IStorageService ;
// cuando un componente solicite al DI la inyeccion de un servicio q implemente a interface necesita esta constante
export const MY_STORAGESERVICES_TOKEN = new InjectionToken<IStorageService>('KeyStorageServices');

