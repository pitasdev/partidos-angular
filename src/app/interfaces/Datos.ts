import { TipoDato } from "./TipoDato";
import { TipoEquipo } from "./TipoEquipo";
import { TipoPersona } from "./TipoPersona";

export interface Datos {
    id: string;
    tipoEquipo: TipoEquipo;
    tipoDato: TipoDato;
    minuto: number;
    dorsal: number | TipoPersona;
    tarjeta?: 'amarilla' | 'roja';
}
