import { TipoPersona } from "./TipoPersona";

export interface Tarjeta {
    id: string;
    color: 'amarilla' | 'roja';
    dorsal: number | TipoPersona;
    minuto: number;
}
