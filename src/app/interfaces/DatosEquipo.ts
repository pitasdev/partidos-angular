import { Gol } from "./Gol";
import { Tarjeta } from "./Tarjeta";

export interface DatosEquipo {
    equipo: string;
    escudo: string;
    goles: number;
    faltasParte1: number;
    faltasParte2: number;
    listaGoles: Gol[];
    listaTarjetas: Tarjeta[];
}
