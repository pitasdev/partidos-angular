import { DatosEquipo } from "./DatosEquipo";
import { Estado } from "./Estado";
import { ModoTiempo } from "./ModoTiempo";

export interface AppData {
    estado: Estado;
    parte: number;
    tiempo: number;
    minutosParte: number;
    modoTiempo: ModoTiempo;
    local: DatosEquipo;
    visitante: DatosEquipo;
}
