import { Component, OnInit, inject } from '@angular/core';
import { ControlesEquipoComponent } from './components/controles-equipo/controles-equipo.component';
import { TiempoComponent } from './components/tiempo/tiempo.component';
import { ResultadoComponent } from './components/resultado/resultado.component';
import { FaltasComponent } from './components/faltas/faltas.component';
import { ConfigurarPartidoComponent } from './components/configurar-partido/configurar-partido.component';
import { InfoComponent } from './components/info/info.component';
import { TipoEquipo } from './components/interfaces/TipoEquipo';
import { ModalSumarComponent } from './components/modal-sumar/modal-sumar.component';
import { Gol } from './components/interfaces/Gol';
import { Tarjeta } from './components/interfaces/Tarjeta';
import { Datos } from './components/interfaces/Datos';
import { ModalRestarComponent } from './components/modal-restar/modal-restar.component';
import { TipoDato } from './components/interfaces/TipoDato';
import { Estado } from './components/interfaces/Estado';
import { EstadoService } from './services/estado.service';
import { ModalConfirmacionComponent } from './components/modal-confirmacion/modal-confirmacion.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ControlesEquipoComponent, TiempoComponent, ResultadoComponent, FaltasComponent, ConfigurarPartidoComponent, InfoComponent, ModalSumarComponent, ModalRestarComponent, ModalConfirmacionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  // Datos app
  estado!: Estado;
  equipoLocal: string = 'Local';
  equipoVisitante: string = 'Visitante';
  escudoLocal: string = '';
  escudoVisitante: string = '';
  golesLocal: number = 10;
  golesVisitante: number = 10;
  parte: number = 1;
  faltasLocalParte1: number = 0;
  faltasVisitanteParte1: number = 0;
  faltasLocalParte2: number = 0;
  faltasVisitanteParte2: number = 0;
  listaGolesLocal: Gol[] = [];
  listaTarjetasLocal: Tarjeta[] = [];
  listGolesVisitante: Gol[] = [];
  listaTarjetasVisitante: Tarjeta[] = [];
  // Datos modal
  modalTipoEquipo!: TipoEquipo;
  modalTipoDato!: TipoDato;
  modalListaDatos!: any[];
  openModalSumar: boolean = false;
  openModalRestar: boolean = false;
  // Servicios
  estadoService = inject(EstadoService);
  title = inject(Title);

  ngOnInit(): void {
    this.estadoService.estadoActual.subscribe(estadoActual => { this.estado = estadoActual; });
  }

  sumarGol(event: TipoEquipo): void {
    if (event == 'local') {
      if (this.golesLocal == 99) return;
      this.openModalSumar = true;
      this.modalTipoEquipo = 'local';
      this.modalTipoDato = 'gol';
    } else if (event == 'visitante') {
      if (this.golesVisitante == 99) return;
      this.openModalSumar = true;
      this.modalTipoEquipo = 'visitante';
      this.modalTipoDato = 'gol';
    }
  }

  restarGol(event: TipoEquipo): void {
    if (event == 'local') {
      if (this.golesLocal == 0) return;
      this.openModalRestar = true;
      this.modalTipoEquipo = 'local';
      this.modalTipoDato = 'gol';
      this.modalListaDatos = this.listaGolesLocal;
    } else if (event == 'visitante') {
      if (this.golesVisitante == 0) return;
      this.openModalRestar = true;
      this.modalTipoEquipo = 'visitante';
      this.modalTipoDato = 'gol';
      this.modalListaDatos = this.listGolesVisitante;
    }
  }

  sumarFalta(event: TipoEquipo): void {
    if (event == 'local' && this.parte == 1) {
      if (this.faltasLocalParte1 == 5) return;
      this.faltasLocalParte1++;
    } else if (event == 'local' && this.parte == 2) {
      if (this.faltasLocalParte2 == 5) return;
      this.faltasLocalParte2++;
    } else if (event == 'visitante' && this.parte == 1) {
      if (this.faltasVisitanteParte1 == 5) return;
      this.faltasVisitanteParte1++;
    } else if (event == 'visitante' && this.parte == 2) {
      if (this.faltasVisitanteParte2 == 5) return;
      this.faltasVisitanteParte2++;
    }
  }

  restarFalta(event: TipoEquipo): void {
    if (event == 'local' && this.parte == 1) {
      if (this.faltasLocalParte1 == 0) return;
      this.faltasLocalParte1--;
    } else if (event == 'local' && this.parte == 2) { 
      if (this.faltasLocalParte2 == 0) return;
      this.faltasLocalParte2--;
    } else if (event == 'visitante' && this.parte == 1) {
      if (this.faltasVisitanteParte1 == 0) return;
      this.faltasVisitanteParte1--;
    } else if (event == 'visitante' && this.parte == 2) { 
      if (this.faltasVisitanteParte2 == 0) return;
      this.faltasVisitanteParte2--;
    }
  }

  anadirTarjeta(event: TipoEquipo): void {
    this.openModalSumar = true;
    this.modalTipoEquipo = event;
    this.modalTipoDato = 'tarjeta';
  }

  reiniciar(): void {
    this.equipoLocal = 'Local';
    this.equipoVisitante = 'Visitante';
    this.escudoLocal = '';
    this.escudoVisitante = '';
    this.golesLocal = 0;
    this.golesVisitante = 0;
    this.parte = 1;
    this.faltasLocalParte1 = 0;
    this.faltasVisitanteParte1 = 0;
    this.faltasLocalParte2 = 0;
    this.faltasVisitanteParte2 = 0;
    this.listaGolesLocal = [];
    this.listaTarjetasLocal = [];
    this.listGolesVisitante = [];
    this.listaTarjetasVisitante = [];
    this.title.setTitle('Partido');
  }

  guardarDatos(event: Datos | null): void {
    if (event?.tipoEquipo == 'local' && event.tipoDato == 'gol') {
      this.listaGolesLocal.push({ id: event.id, dorsal: event.dorsal, minuto: event.minuto });
      this.golesLocal++;
    } else if (event?.tipoEquipo == 'local' && event.tipoDato == 'tarjeta') {
      this.listaTarjetasLocal.push({ id: event.id, dorsal: event.dorsal, minuto: event.minuto, color: event.tarjeta! });
    } else if (event?.tipoEquipo == 'visitante' && event.tipoDato == 'gol') {
      this.listGolesVisitante.push({ id: event.id, dorsal: event.dorsal, minuto: event.minuto });
      this.golesVisitante++;
    } else if (event?.tipoEquipo == 'visitante' && event.tipoDato == 'tarjeta') {
      this.listaTarjetasVisitante.push({ id: event.id, dorsal: event.dorsal, minuto: event.minuto, color: event.tarjeta! });
    }

    this.openModalSumar = false;
    this.title.setTitle(`${this.equipoLocal} ${this.golesLocal} - ${this.golesVisitante} ${this.equipoVisitante}`);
  }

  eliminarDatos(event: string | null): void {
    if (event) {
      const i: number = this.modalListaDatos.findIndex(dato => dato.id == event);

      if (i != -1) {
        this.modalListaDatos.splice(i, 1);
        const splitID = event.split('-');

        if (splitID[0] == 'local' && splitID[1] == 'gol') this.golesLocal--;
        else if (splitID[0] == 'visitante' && splitID[1] == 'gol') this.golesVisitante--;
      }
    }

    this.openModalRestar = false;
    this.title.setTitle(`${this.equipoLocal} ${this.golesLocal} - ${this.golesVisitante} ${this.equipoVisitante}`);
  }

  configurarEquipos(event: any): void {
    this.equipoLocal = event.equipoLocal;
    this.equipoVisitante = event.equipoVisitante;
    this.escudoLocal = event.escudoLocal;
    this.escudoVisitante = event.escudoVisitante;

    this.title.setTitle(`${this.equipoLocal} ${this.golesLocal} - ${this.golesVisitante} ${this.equipoVisitante}`);
  }

  cambiarParte(event: number): void {
    this.parte = event;
  }
}
