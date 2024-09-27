import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { Jugador } from '../../interfaces/Jugador';
import { JugadoresService } from '../../services/jugadores.service';
import { TipoEquipo } from '../../interfaces/TipoEquipo';
import { EquipoLS } from '../../interfaces/EquipoLS';
import { ClickDirective } from '../../directives/click.directive';

@Component({
  selector: 'app-modal-jugador',
  standalone: true,
  imports: [FormsModule, CommonModule, ModalConfirmacionComponent, ClickDirective],
  templateUrl: './modal-jugador.component.html'
})
export class ModalJugadorComponent implements OnInit {
  @Input() tipoEquipo!: TipoEquipo;
  @Input() accionModal!: string;
  dorsal!: number;
  nombre!: string;
  jugadores!: Jugador[];
  dorsalValido: boolean = true;

  equipo!: string;
  equiposLS: EquipoLS[] = [];

  openModalConfirmacion: boolean = false;
  mensajeModal: string = "";
  jugadorAEliminar!: Jugador;
  EquipoAEliminar!: EquipoLS;

  jugadoresService = inject(JugadoresService);

  @Output() eventoNuevoJugador = new EventEmitter<Jugador>();
  @Output() eventoGuardarEquipo = new EventEmitter<EquipoLS>();
  @Output() eventoReemplarEquipo = new EventEmitter<EquipoLS>();
  @Output() eventoEliminarJugador = new EventEmitter<Jugador>();
  @Output() eventoEliminarEquipoLS = new EventEmitter<EquipoLS>();
  @Output() eventoCloseModal = new EventEmitter<void>();

  ngOnInit(): void {
    this.jugadoresService.listaJugadores$.subscribe(() => this.jugadores = this.jugadoresService.obtenerListaJugadores(this.tipoEquipo)).unsubscribe();

    this.equiposLS = this.jugadoresService.obtenerEquiposLS();
  }

  validarDorsal(): void {
    if (!this.dorsal) return;

    if (this.dorsal <= 0) this.dorsal = 1;
    else if (this.dorsal > 99) this.dorsal = 99;
  }

  validarNombre(): void {
    this.nombre = this.nombre?.slice(0, 10);
  }

  confirmarEliminarJugador(jugador: Jugador): void {
    this.jugadorAEliminar = jugador;
    this.mensajeModal = `¿Está seguro/a que quiere eliminar al jugador número <b>${jugador.dorsal}</b><br> <b>${jugador.nombre}</b>`;
    this.openModalConfirmacion = true;
  }

  eliminarJugador(event: boolean): void {
    this.openModalConfirmacion = false;

    if (!event) return;

    this.eventoEliminarJugador.emit(this.jugadorAEliminar);
  }

  guardarEquipo(): void {
    if (!this.equipo) return;

    const jugadoresGuardados: EquipoLS[] = this.jugadoresService.obtenerEquiposLS();
    let nombreEquipoDisponible: boolean = true;

    jugadoresGuardados.forEach(e => {
      if (e.nombre == this.equipo) {
        nombreEquipoDisponible = false;

        this.mensajeModal = `El equipo <b>${this.equipo}</b> ya existe<br>¿Desea reemplazarlo?`;
        this.openModalConfirmacion = true;
        
        return;
      }
    })

    if (nombreEquipoDisponible) {
      const nuevoEquipo: EquipoLS = {
        nombre: this.equipo,
        jugadores: this.jugadores
      };
  
      this.eventoGuardarEquipo.emit(nuevoEquipo);
    }
  }

  reemplazarEquipo(event: boolean): void {
    if (!event) {
      this.openModalConfirmacion = false;
      return;
    }

    const reemplazarEquipo: EquipoLS = {
      nombre: this.equipo,
      jugadores: this.jugadores
    };

    this.eventoReemplarEquipo.emit(reemplazarEquipo);
  }

  cargarEquipoLS(equipo: EquipoLS): void {
    this.jugadoresService.cargarEquipo(equipo, this.tipoEquipo);

    this.eventoCloseModal.emit();
  }

  confirmarEliminarEquipoLS(equipo: EquipoLS): void {
    this.EquipoAEliminar = equipo;

    this.mensajeModal = `Esta seguro/a de eliminar el equipo <b>${equipo.nombre}<b>`;
    this.openModalConfirmacion = true;
  }

  eliminarEquipoLS(event: boolean): void {
    this.openModalConfirmacion = false;

    if (event) this.eventoEliminarEquipoLS.emit(this.EquipoAEliminar);
  }

  guardar(): void {
    this.dorsalValido = true;

    if (!this.dorsal || !this.nombre || this.jugadores.find(j => j.dorsal == this.dorsal)) {
      this.dorsalValido = false;
      return;
    }

    const jugador: Jugador = {
      dorsal: this.dorsal,
      nombre: this.nombre
    };

    this.eventoNuevoJugador.emit(jugador);
  }

  cancelar(): void {
    this.eventoCloseModal.emit();
  }
}
