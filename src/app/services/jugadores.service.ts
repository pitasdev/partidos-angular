import { Injectable } from '@angular/core';
import { Jugador } from '../interfaces/Jugador';
import { TipoEquipo } from '../interfaces/TipoEquipo';
import { ListaJugadores } from '../interfaces/ListaJugadores';
import { BehaviorSubject } from 'rxjs';
import { EquipoLS } from '../interfaces/EquipoLS';

@Injectable({
  providedIn: 'root'
})
export class JugadoresService {
  private _listaJugadores: BehaviorSubject<ListaJugadores> = new BehaviorSubject<ListaJugadores>({
    local: [],
    visitante: []
  });
  listaJugadores$ = this._listaJugadores.asObservable();

  anadirJugador(jugador: Jugador, tipoEquipo: TipoEquipo): void {
    const listaJugadores: ListaJugadores = this._listaJugadores.getValue();
    if (tipoEquipo == 'local') {
      listaJugadores.local.push(jugador);
      listaJugadores.local.sort((a, b) => {
        if (a.dorsal > b.dorsal) return 1;
        else if (a.dorsal < b.dorsal) return -1;
        else return 0;
      });
    } else {
      listaJugadores.visitante.push(jugador);
      listaJugadores.visitante.sort((a, b) => {
        if (a.dorsal > b.dorsal) return 1;
        else if (a.dorsal < b.dorsal) return -1;
        else return 0;
      });
    }

    this._listaJugadores.next(listaJugadores);
  }

  obtenerListaJugadores(tipoEquipo: TipoEquipo): Jugador[] {
    const listaJugadores = this._listaJugadores.getValue();

    if (tipoEquipo == 'local') return listaJugadores.local;
    else if (tipoEquipo == 'visitante') return listaJugadores.visitante;
    else return [];
  }

  eliminarJugador(jugador: Jugador, tipoEquipo: TipoEquipo): void {
    const listaJugadores = this._listaJugadores.getValue();

    if (tipoEquipo == 'local') {
      const i: number = listaJugadores.local.findIndex(j => j == jugador);

      if (i != -1) {
        listaJugadores.local.splice(i, 1);
      }
    } else if (tipoEquipo == 'visitante') {
      const i: number = listaJugadores.visitante.findIndex(j => j == jugador);

      if (i != -1) {
        listaJugadores.visitante.splice(i, 1);
      }
    }

    this._listaJugadores.next(listaJugadores);
  }

  guardarEquipo(equipo: EquipoLS): void {
    const equipos: EquipoLS[] = this.obtenerEquiposLS();
    equipos.push(equipo);

    localStorage.setItem('equipos', JSON.stringify(equipos));
  }

  cargarEquipo(equipo: EquipoLS, tipoEquipo: TipoEquipo): void {
    const listaJugadores = this._listaJugadores.getValue();
    const equipos: EquipoLS[] = this.obtenerEquiposLS();

    const i: number = equipos.findIndex(e => e.nombre == equipo.nombre);

    if (i != -1) {
      if (tipoEquipo == 'local') listaJugadores.local = equipos[i].jugadores;
      else if (tipoEquipo == 'visitante') listaJugadores.visitante = equipos[i].jugadores;

      this._listaJugadores.next(listaJugadores);
    }
  }

  obtenerEquiposLS(): EquipoLS[] {
    const equipos: EquipoLS[] = JSON.parse(localStorage.getItem('equipos')!);

    if (Array.isArray(equipos)) return equipos;
    else return [];
  }

  eliminarEquipoLS(equipo: EquipoLS): void {
    const equipos: EquipoLS[] = this.obtenerEquiposLS();

    const i: number = equipos.findIndex(e => e.nombre == equipo.nombre);

    if (i != -1) {
      equipos.splice(i, 1);
    }

    localStorage.setItem('equipos', JSON.stringify(equipos));
  }

  reemplazarEquipoLS(equipo: EquipoLS): void {
    this.eliminarEquipoLS(equipo);
    this.guardarEquipo(equipo);
  }
}
