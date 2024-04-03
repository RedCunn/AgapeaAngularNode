import { IDatosPedido } from "./datospedido";
import { ILibro } from "./libro";

export interface IPedido {
    idCliente : string;
    idPedido : string;
    fechaPedido:          Date;
    estadoPedido:         string;
    elementosPedido:      Array<{libroElemento: ILibro,cantidadElemento: number}>;
    subTotalPedido:       number;
    gastosEnvio:          number;
    totalPedido:          number;
    datosPedido : IDatosPedido;
}