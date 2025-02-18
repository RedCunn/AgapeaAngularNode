import { IMunicipio } from "./municipio";
import { IProvincia } from "./provincia";

export interface IDireccion{
    idDireccion : string;
    calle : string;
    cp : number;
    pais : string;
    provincia : IProvincia;
    municipio : IMunicipio;
    esPrincipal : boolean;
    esFacturacion : boolean
}