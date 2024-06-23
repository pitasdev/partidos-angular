import { DatosEquipo } from "./DatosEquipo";
import { Estado } from "./Estado";

export interface AppData {
    estado: Estado;
    parte: number;
    tiempo: string;
    local: DatosEquipo;
    visitante: DatosEquipo;
}
