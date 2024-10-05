import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { TipoDato } from '../../interfaces/TipoDato';
import { TipoEquipo } from '../../interfaces/TipoEquipo';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { AppDataService } from '../../services/app-data.service';
import { Gol } from '../../interfaces/Gol';
import { Tarjeta } from '../../interfaces/Tarjeta';
import { ClickDirective } from '../../directives/click.directive';
import { Jugador } from '../../interfaces/Jugador';
import { JugadoresService } from '../../services/jugadores.service';
import { TipoPersona } from '../../interfaces/TipoPersona';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-restar',
  standalone: true,
  imports: [ModalConfirmacionComponent, ClickDirective, CommonModule],
  templateUrl: './modal-restar.component.html'
})
export class ModalRestarComponent implements OnInit {
  @Input() tipoEquipo!: TipoEquipo;
  @Input() tipoDato!: TipoDato;
  listaGoles: Gol[] = [];
  listaTarjetas: Tarjeta[] = [];
  nombreEquipo!: string;
  jugadores!: Jugador[];

  openModalConfirmacion: boolean = false;
  mensajeConfirmacion: string = '';
  id: string = '';

  appDataService = inject(AppDataService);
  jugadoresService = inject(JugadoresService);

  @Output() eventoEliminar = new EventEmitter<string | null>();

  ngOnInit(): void {
    this.appDataService.appData$.subscribe(data => {
      if (this.tipoEquipo == 'local') {
        this.listaGoles = data.local.listaGoles;
        this.listaTarjetas = data.local.listaTarjetas;
        this.nombreEquipo = data.local.equipo;
      } else if (this.tipoEquipo == 'visitante') {
        this.listaGoles = data.visitante.listaGoles;
        this.listaTarjetas = data.visitante.listaTarjetas;
        this.nombreEquipo = data.visitante.equipo;
      }
    })

    this.jugadoresService.listaJugadores$.subscribe(data => {
      if (this.tipoEquipo == 'local') this.jugadores = data.local;
      else if (this.tipoEquipo == 'visitante') this.jugadores = data.visitante;
    })
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

  confirmacionEliminar(event: Event): void {
    this.id = (event.currentTarget as HTMLElement).id;
    const splitID: string[] = this.id.split('-');

    this.openModalConfirmacion = true;
    if (this.tipoDato == 'gol') {
      this.mensajeConfirmacion = `¿Está seguro/a que quiere eliminar el <b>${splitID[1]}</b> del <b>${this.nombreEquipo}</b> en el <b>minuto ${splitID[2]}</b>`;
  
      if (splitID[3] != 'undefined') this.mensajeConfirmacion += ` del <b>jugador ${splitID[3]}</b>`;
      this.mensajeConfirmacion += '?';
    } else if (this.tipoDato == 'tarjeta') {
      this.mensajeConfirmacion = `¿Está seguro/a que quiere eliminar la <b>${splitID[1]} ${splitID[4]}</b> del <b>${this.nombreEquipo}</b> en el <b>minuto ${splitID[2]}</b>`;
      console.log(splitID);
      
      if (splitID[3] == 'E') this.mensajeConfirmacion += ' del <b>Entrenador</b>?';
      else if (splitID[3] == '2E') this.mensajeConfirmacion += ' del <b>2º Entrenador</b>?';
      else if (splitID[3] == 'D') this.mensajeConfirmacion += ' del <b>Delegado</b>?';
      else if (splitID[3] == 'A') this.mensajeConfirmacion += ' del <b>Auxiliar</b>?';
      else this.mensajeConfirmacion += ` del <b>jugador ${splitID[3]}</b>?`;
    }
  }

  eliminar(event: boolean): void {
    this.openModalConfirmacion = false;

    if (!event) return;

    this.eventoEliminar.emit(this.id);
  }

  cancelar(): void {
    this.eventoEliminar.emit();
  }
}
