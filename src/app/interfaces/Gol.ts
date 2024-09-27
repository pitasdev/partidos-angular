import { TipoPersona } from "./TipoPersona";

export interface Gol {
    id: string;
    dorsal: number | TipoPersona;
    minuto: number;
}
