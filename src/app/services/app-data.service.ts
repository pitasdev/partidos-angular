import { Injectable, inject } from '@angular/core';
import { Gol } from '../interfaces/Gol';
import { Tarjeta } from '../interfaces/Tarjeta';
import { Estado } from '../interfaces/Estado';
import { TipoEquipo } from '../interfaces/TipoEquipo';
import { BehaviorSubject } from 'rxjs';
import { AppData } from '../interfaces/AppData';
import { DatosEquipo } from '../interfaces/DatosEquipo';
import { Title } from '@angular/platform-browser';
import { ModoTiempo } from '../interfaces/ModoTiempo';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  private _appData: BehaviorSubject<AppData> = new BehaviorSubject<AppData>({
    estado: 'configuracion',
    parte: 1,
    tiempo: 0,
    minutosParte: 25,
    modoTiempo: 'ascendente',
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
  appData$ = this._appData.asObservable();

  private _title = inject(Title);

  setEstado(estado: Estado): void {
    const actualData: AppData = this._appData.getValue();
    actualData.estado = estado;

    this._appData.next(actualData);
    this.setLocalStorage();
  }

  setParte(parte: number): void {
    const actualData: AppData = this._appData.getValue();
    actualData.parte = parte;

    this._appData.next(actualData);
    this.setLocalStorage();
  }

  setTiempo(tiempo: number): void {
    const actualData: AppData = this._appData.getValue();
    actualData.tiempo = tiempo;

    this._appData.next(actualData);
    this.setLocalStorage();
  }

  setConfiguracionTiempo(minutosParte: number, modoTiempo: ModoTiempo): void {
    const actualData: AppData = this._appData.getValue();
    actualData.minutosParte = minutosParte;
    actualData.modoTiempo = modoTiempo;

    if (modoTiempo == 'descendente') this.setTiempo(minutosParte * 60);

    this._appData.next(actualData);
    this.setLocalStorage;
  }

  setDatosEquipo(datos: Partial<DatosEquipo>, tipoEquipo: TipoEquipo): void {
    const actualData: AppData = this._appData.getValue();

    if (tipoEquipo == 'local') actualData.local = { ...actualData.local, ...datos };
    else if (tipoEquipo == 'visitante') actualData.visitante = { ...actualData.visitante, ...datos };

    this._appData.next(actualData);
    this.updateTitle();
    this.setLocalStorage();
  }

  agregarGol(gol: Gol, tipoEquipo: TipoEquipo): void {
    const actualData: AppData = this._appData.getValue();

    if (tipoEquipo == 'local') {
      actualData.local.listaGoles.push(gol);

      actualData.local.listaGoles.sort((a, b) => {
        if (a.minuto > b.minuto) return 1;
        else if (a.minuto < b.minuto) return -1;
        else return 0;
      });
    } else if (tipoEquipo == 'visitante') {
      actualData.visitante.listaGoles.push(gol);

      actualData.visitante.listaGoles.sort((a, b) => {
        if (a.minuto > b.minuto) return 1;
        else if (a.minuto < b.minuto) return -1;
        else return 0;
      });
    }

    this._appData.next(actualData);
    this.updateTitle();
    this.setLocalStorage();
  }

  quitarGol(id: string, tipoEquipo: TipoEquipo): void {
    const actualData: AppData = this._appData.getValue();

    if (tipoEquipo == 'local') {
      const i: number = actualData.local.listaGoles.findIndex((gol: Gol) => gol.id == id);
      if (i != -1) actualData.local.listaGoles.splice(i, 1);
    } else {
      const i: number = actualData.visitante.listaGoles.findIndex((gol: Gol) => gol.id == id);
      if (i != -1) actualData.visitante.listaGoles.splice(i, 1);
    }

    this._appData.next(actualData);
    this.updateTitle();
    this.setLocalStorage();
  }

  agregarTarjeta(tarjeta: Tarjeta, tipoEquipo: TipoEquipo): void {
    const actualData: AppData = this._appData.getValue();
    const splitID: string[] = tarjeta.id.split('-');

    if (tipoEquipo == 'local') {
      // Busca si el jugador ya tiene otra tarjeta amarilla
      const i: number = actualData.local.listaTarjetas.findIndex(t => t.id.endsWith(`-${splitID[3]}-amarilla`));
      actualData.local.listaTarjetas.push(tarjeta);

      if (i != -1 && tarjeta.color == 'amarilla') {
        actualData.local.listaTarjetas.push({ ...tarjeta, ...{ id: `${splitID[0]}-${splitID[1]}-${splitID[2]}-${splitID[3]}-roja`, color: 'roja' } });
      }

      actualData.local.listaTarjetas.sort((a, b) => {
        if (a.minuto > b.minuto) return 1;
        else if (a.minuto < b.minuto) return -1;
        else return 0;
      });
    } else if (tipoEquipo == 'visitante') {
      // Busca si el jugador ya tiene otra tarjeta amarilla
      const i: number = actualData.visitante.listaTarjetas.findIndex(t => t.id.endsWith(`-${splitID[3]}-amarilla`));
      actualData.visitante.listaTarjetas.push(tarjeta);

      if (i != -1 && tarjeta.color == 'amarilla') {
        actualData.visitante.listaTarjetas.push({ ...tarjeta, ...{ id: `${splitID[0]}-${splitID[1]}-${splitID[2]}-${splitID[3]}-roja`, color: 'roja' } });
      }

      actualData.visitante.listaTarjetas.sort((a, b) => {
        if (a.minuto > b.minuto) return 1;
        else if (a.minuto < b.minuto) return -1;
        else return 0;
      });
    }

    this._appData.next(actualData);
    this.setLocalStorage();
  }

  quitarTarjeta(id: string, tipoEquipo: TipoEquipo): void {
    const actualData: AppData = this._appData.getValue();

    if (tipoEquipo == 'local') {
      const i: number = actualData.local.listaTarjetas.findIndex((tarjeta: Tarjeta) => tarjeta.id == id);
      if (i != -1) actualData.local.listaTarjetas.splice(i, 1);
    } else {
      const i: number = actualData.visitante.listaTarjetas.findIndex((tarjeta: Tarjeta) => tarjeta.id == id);
      if (i != -1) actualData.visitante.listaTarjetas.splice(i, 1);
    }

    this._appData.next(actualData);
    this.setLocalStorage();
  }

  resetData(): void {
    this._appData.next({
      estado: 'configuracion',
      parte: 1,
      tiempo: 0,
      minutosParte: 25,
      modoTiempo: 'ascendente',
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
    localStorage.clear();
  }

  getData(): any {
    const actualData = this._appData.getValue();
    const data = {
      local: {
        equipo: actualData.local.equipo,
        goles: actualData.local.goles,
        faltasParte1: actualData.local.faltasParte1,
        faltasParte2: actualData.local.faltasParte2,
        listaGoles: actualData.local.listaGoles,
        listaTarjetas: actualData.local.listaTarjetas
      },
      visitante: {
        equipo: actualData.visitante.equipo,
        goles: actualData.visitante.goles,
        faltasParte1: actualData.visitante.faltasParte1,
        faltasParte2: actualData.visitante.faltasParte2,
        listaGoles: actualData.visitante.listaGoles,
        listaTarjetas: actualData.visitante.listaTarjetas
      }
    };

    return data;
  }

  cargarLocalStorage(): void {
    const data: AppData = JSON.parse(localStorage.getItem('partido')!);

    if (data) this._appData.next(data);
  }

  private setLocalStorage(): void {
    const actualData: AppData = this._appData.getValue();

    localStorage.setItem('partido', JSON.stringify(actualData));
    localStorage.setItem('createdAt', new Date().toString());
  }

  private updateTitle(): void {
    const actualData: AppData = this._appData.getValue();
    this._title.setTitle(`${actualData.local.equipo} ${actualData.local.goles} - ${actualData.visitante.goles} ${actualData.visitante.equipo}`);
  }
}
