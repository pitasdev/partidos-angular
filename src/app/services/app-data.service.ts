import { Injectable, inject } from '@angular/core';
import { Gol } from '../interfaces/Gol';
import { Tarjeta } from '../interfaces/Tarjeta';
import { Estado } from '../interfaces/Estado';
import { TipoEquipo } from '../interfaces/TipoEquipo';
import { BehaviorSubject } from 'rxjs';
import { AppData } from '../interfaces/AppData';
import { DatosEquipo } from '../interfaces/DatosEquipo';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  private _appData: BehaviorSubject<AppData> = new BehaviorSubject<AppData>({
    estado: 'configuracion',
    parte: 1,
    tiempo: '00:00',
    local: {
      equipo: 'Local',
      escudo: 'default.png',
      goles: 0,
      faltasParte1: 0,
      faltasParte2: 0,
      listaGoles: [],
      listaTarjetas: []
    },
    visitante: {
      equipo: 'Visitante',
      escudo: 'default.png',
      goles: 0,
      faltasParte1: 0,
      faltasParte2: 0,
      listaGoles: [],
      listaTarjetas: []
    }
  })
  appData$ = this._appData.asObservable();

  title = inject(Title);

  setEstado(estado: Estado): void {
    const actualData = this._appData.getValue();
    actualData.estado = estado;

    this._appData.next(actualData);
  }

  setParte(parte: number): void {
    const actualData = this._appData.getValue();
    actualData.parte = parte;

    this._appData.next(actualData);
  }

  setTiempo(tiempo: string): void {
    const actualData = this._appData.getValue();
    actualData.tiempo = tiempo;

    this._appData.next(actualData);
  }

  setDatosEquipo(datos: Partial<DatosEquipo>, tipoEquipo: TipoEquipo): void {
    const actualData = this._appData.getValue();

    if (tipoEquipo == 'local') actualData.local = { ...actualData.local, ...datos };
    else if (tipoEquipo == 'visitante') actualData.visitante = { ...actualData.visitante, ...datos };

    this._appData.next(actualData);
    this.updateTitle();
  }

  agregarGol(gol: Gol, tipoEquipo: TipoEquipo): void {
    const actualData = this._appData.getValue();

    if (tipoEquipo == 'local') actualData.local.listaGoles.push(gol);
    else if (tipoEquipo == 'visitante') actualData.visitante.listaGoles.push(gol);

    this._appData.next(actualData);
    this.updateTitle();
  }

  quitarGol(id: string, tipoEquipo: TipoEquipo): void {
    const actualData = this._appData.getValue();

    if (tipoEquipo == 'local') {
      const i: number = actualData.local.listaGoles.findIndex((gol: Gol) => gol.id == id);
      if (i != -1) actualData.local.listaGoles.splice(i, 1);
    } else {
      const i: number = actualData.visitante.listaGoles.findIndex((gol: Gol) => gol.id == id);
      if (i != -1) actualData.visitante.listaGoles.splice(i, 1);
    }

    this._appData.next(actualData);
    this.updateTitle();
  }

  agregarTarjeta(tarjeta: Tarjeta, tipoEquipo: TipoEquipo): void {
    const actualData = this._appData.getValue();

    if (tipoEquipo == 'local') actualData.local.listaTarjetas.push(tarjeta);
    else if (tipoEquipo == 'visitante') actualData.visitante.listaTarjetas.push(tarjeta);

    this._appData.next(actualData);
  }

  quitarTarjeta(id: string, tipoEquipo: TipoEquipo): void {
    const actualData = this._appData.getValue();

    if (tipoEquipo == 'local') {
      const i: number = actualData.local.listaTarjetas.findIndex((tarjeta: Tarjeta) => tarjeta.id == id);
      if (i != -1) actualData.local.listaTarjetas.splice(i, 1);
    } else {
      const i: number = actualData.visitante.listaTarjetas.findIndex((tarjeta: Tarjeta) => tarjeta.id == id);
      if (i != -1) actualData.visitante.listaTarjetas.splice(i, 1);
    }

    this._appData.next(actualData);
  }

  resetData(): void {
    this._appData.next({
      estado: 'configuracion',
      parte: 1,
      tiempo: '00:00',
      local: {
        equipo: 'Local',
        escudo: 'default.png',
        goles: 0,
        faltasParte1: 0,
        faltasParte2: 0,
        listaGoles: [],
        listaTarjetas: []
      },
      visitante: {
        equipo: 'Visitante',
        escudo: 'default.png',
        goles: 0,
        faltasParte1: 0,
        faltasParte2: 0,
        listaGoles: [],
        listaTarjetas: []
      }
    });

    this.updateTitle();
  }

  updateTitle(): void {
    const actualData = this._appData.getValue();
    this.title.setTitle(`${actualData.local.equipo} ${actualData.local.goles} - ${actualData.visitante.goles} ${actualData.visitante.equipo}`);
  }
}
