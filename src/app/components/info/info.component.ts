import { Component, Input, OnInit, inject } from '@angular/core';
import { Gol } from '../../interfaces/Gol';
import { Tarjeta } from '../../interfaces/Tarjeta';
import { TipoEquipo } from '../../interfaces/TipoEquipo';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { ClickDirective } from '../../directives/click.directive';
import { AppDataService } from '../../services/app-data.service';
import { ModalSumarComponent } from '../modal-sumar/modal-sumar.component';
import { ModalRestarComponent } from '../modal-restar/modal-restar.component';
import { TipoDato } from '../../interfaces/TipoDato';
import { Datos } from '../../interfaces/Datos';
import { JugadoresService } from '../../services/jugadores.service';
import { Jugador } from '../../interfaces/Jugador';
import { ModalJugadorComponent } from '../modal-jugador/modal-jugador.component';
import { EquipoLS } from '../../interfaces/EquipoLS';
import { TipoPersona } from '../../interfaces/TipoPersona';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [ModalConfirmacionComponent, ClickDirective, ModalSumarComponent, ModalRestarComponent, ModalJugadorComponent],
  templateUrl: './info.component.html'
})
export class InfoComponent implements OnInit {
  @Input() tipoEquipo!: TipoEquipo;
  goles: Gol[] = [];
  tarjetas: Tarjeta[] = [];
  nombreEquipo!: string;
  jugadores!: Jugador[];

  openModalConfirmacion: boolean = false;
  modalTipoDato!: TipoDato;
  mensajeConfirmacion: string = '';
  id: string = '';
  openModalSumar: boolean = false;
  openModalRestar: boolean = false;
  openModalJugador: boolean = false;
  mostrarJugadores: boolean = false;
  accionModalJugador: string = '';

  appDataService = inject(AppDataService);
  jugadoresService = inject(JugadoresService);

  ngOnInit(): void {
    this.appDataService.appData$.subscribe(data => {
      if (this.tipoEquipo == 'local') {
        this.goles = data.local.listaGoles;
        this.tarjetas = data.local.listaTarjetas;
        this.nombreEquipo = data.local.equipo;
      } else if (this.tipoEquipo == 'visitante') {
        this.goles = data.visitante.listaGoles;
        this.tarjetas = data.visitante.listaTarjetas;
        this.nombreEquipo = data.visitante.equipo;
      }
    })

    this.jugadoresService.listaJugadores$.subscribe(data => {
      if (this.tipoEquipo == 'local') this.jugadores = data.local
      else if (this.tipoEquipo == 'visitante') this.jugadores = data.visitante
    })
  }

  sumarTarjeta(): void {
    this.modalTipoDato = 'tarjeta';
    this.openModalSumar = true;
  }

  restarTarjeta(): void {
    if (this.tarjetas.length == 0) return;

    this.modalTipoDato = 'tarjeta';
    this.openModalRestar = true;
  }

  guardarTarjeta(event: Datos | null): void {
    if (event?.tipoEquipo == 'local' && event.tipoDato == 'tarjeta') this.appDataService.agregarTarjeta({ id: event.id, dorsal: event.dorsal, minuto: event.minuto, color: event.tarjeta! }, 'local');
    else if (event?.tipoEquipo == 'visitante' && event.tipoDato == 'tarjeta') this.appDataService.agregarTarjeta({ id: event.id, dorsal: event.dorsal, minuto: event.minuto, color: event.tarjeta! }, 'visitante');

    this.openModalSumar = false;
  }

  eliminarTarjeta(event: string | null): void {
    if (event) {
      const splitID: string[] = event.split('-');

      if (splitID[0] == 'local' && splitID[1] == 'tarjeta') this.appDataService.quitarTarjeta(event, 'local');
      else if (splitID[0] == 'visitante' && splitID[1] == 'tarjeta') this.appDataService.quitarTarjeta(event, 'visitante');
    }

    this.openModalRestar = false;
  }

  cambiarMostrarJugadores(): void {
    this.mostrarJugadores = !this.mostrarJugadores;
  }

  obtenerNombreJugador(dorsal: number | TipoPersona): string {
    switch (dorsal) {
      case 'E':
        return 'Entrenador';
      case '2E':
        return '2º Entrenador';
      case 'D':
        return 'Delegado';
      case 'A':
        return 'Auxiliar'
      default:
        const existeDorsal = this.jugadores.find(jugador => dorsal == jugador.dorsal);
    
        if (existeDorsal) return existeDorsal.nombre;
        else return dorsal.toString();
    }
  }

  anadirJugador(): void {
    this.accionModalJugador = 'anadir'
    this.openModalJugador = true;
  }

  guardarJugador(event: Jugador): void {
    this.openModalJugador = false;

    if (!event) return;

    this.jugadoresService.anadirJugador(event, this.tipoEquipo);
  }

  confirmarEliminarJugador(): void {
    if (this.jugadores.length == 0) return;

    this.accionModalJugador = 'eliminar';
    this.openModalJugador = true;
  }

  eliminarJugador(event: Jugador): void {
    this.openModalJugador = false;

    if (!event) return;

    this.jugadoresService.eliminarJugador(event, this.tipoEquipo);
  }

  guardarJugadores(): void {
    if (this.jugadores.length == 0) return;

    this.accionModalJugador = 'guardar';
    this.openModalJugador = true;
  }

  cargarEquipo(): void {
    const equipos = this.jugadoresService.obtenerEquiposLS();

    if (equipos.length == 0) return;

    this.accionModalJugador = 'cargar';
    this.openModalJugador = true;
  }

  guardarEquipo(event: EquipoLS): void {
    this.openModalJugador = false;

    this.jugadoresService.guardarEquipo(event);
  }

  reemplazarEquipo(event: EquipoLS): void {
    this.openModalJugador = false;

    this.jugadoresService.reemplazarEquipoLS(event);
  }

  eliminarEquipoLS(event: EquipoLS): void {
    this.openModalJugador = false;

    this.jugadoresService.eliminarEquipoLS(event);
  }

  closeModal(): void {
    this.openModalJugador = false;
  }
}
