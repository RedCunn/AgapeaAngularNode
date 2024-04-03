import { ICliente } from "./cliente";

export interface IRestMessage {
    code: number,
    message: string,
    error? : string,
    token? : string,
    clientdata? : ICliente,
    others?: any 
}