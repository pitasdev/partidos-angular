import { TipoDato } from "./TipoDato";
import { TipoEquipo } from "./TipoEquipo";

export interface Datos {
    id: string;
    tipoEquipo: TipoEquipo;
    tipoDato: TipoDato;
    minuto: number;
    dorsal: number | string;
    tarjeta?: 'amarilla' | 'roja';
}
