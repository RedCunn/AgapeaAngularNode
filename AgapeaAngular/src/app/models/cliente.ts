import { ICuenta } from "./cuenta";
import { IDireccion } from "./direccion";
import { IPedido } from "./pedido";

export interface ICliente {
    idCliente : string;
    nombre:      string;
    apellidos:   string;
    cuenta:      ICuenta;
    telefono:    string;
    direcciones?: IDireccion[];
    pedidos?:     IPedido[];
    genero?:     string;
    fechaNacimiento?:    Date;
    descripcion?:   string;
}