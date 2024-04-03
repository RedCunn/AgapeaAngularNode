import { IDireccion } from "./direccion";

export interface IDatosPedido {
    //envio
      tipoDireccion : string,
      direccionEnvio : IDireccion,
      nombreEnvio : string,
      apellidosEnvio: string,
      emailEnvio: string,
      telefonoEnvio: string,
      otrosDatos?: string,
    //factura
      tipoFactura : string,
      titular? : string,
      docIdentificacion? : string,
      tipoDireccionFacturacion : string,
      direccionFactura? : IDireccion,
    //pago
      metodoPago : string,
      numeroTarjeta? : string,
      cvv? : number,
      banco? : string,
      mesCaducidad? : number,
      anioCaducidad? : number
}

