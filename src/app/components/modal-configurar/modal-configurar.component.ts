import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Equipo } from '../../interfaces/Equipo';
import { TipoEquipo } from '../../interfaces/TipoEquipo';
import { CommonModule } from '@angular/common';
import { ModoTiempo } from '../../interfaces/ModoTiempo';

@Component({
  selector: 'app-modal-configurar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-configurar.component.html'
})
export class ModalConfigurarComponent implements OnInit {
  @Input() listaEquipos: Equipo[] = [];
  listaEquiposFiltrada: Equipo[] = [];
  buscarEquipo: string = '';
  selecEquipo: boolean = false;
  tipoSelecEquipo!: TipoEquipo;

  equipoLocal: string = '';
  equipoVisitante: string = '';
  escudoLocal: string = '';
  escudoVisitante: string = '';
  minutos: number = 25;
  modoTiempo: ModoTiempo = 'ascendente';

  @Output() eventoGuardar = new EventEmitter();

  @ViewChild('selecEquipo') inputSelecEquipo!: ElementRef;

  ngOnInit(): void {
    this.listaEquiposFiltrada = this.listaEquipos;
  }

  guardar(): void {
    if (this.equipoLocal == '' || this.equipoVisitante == '') return;

    const configuracion = {
      equipoLocal: this.equipoLocal,
      equipoVisitante: this.equipoVisitante,
      escudoLocal: this.escudoLocal == '' ? 'default.png' : this.escudoLocal,
      escudoVisitante: this.escudoVisitante == '' ? 'default.png' : this.escudoVisitante,
      minutos: this.minutos,
      modoTiempo: this.modoTiempo
    }

    this.eventoGuardar.emit(configuracion);
  }

  cancelar(): void {
    this.eventoGuardar.emit();
  }

  cancelarSelecEquipo(): void {
    this.selecEquipo = false;
  }

  modalSelecEquipo(tipoEquipo: TipoEquipo): void {
    this.tipoSelecEquipo = tipoEquipo;
    this.selecEquipo = true;

    setTimeout(() => {
      this.inputSelecEquipo.nativeElement.focus();
    }, 0);
  }

  filtrar(): void {
    this.listaEquiposFiltrada = this.listaEquipos.filter(equipo => (equipo.equipo).toLowerCase().includes(this.buscarEquipo.toLowerCase()));
  }

  seleccionarEquipo(equipo: Equipo): void {
    if (this.tipoSelecEquipo == 'local') {
      this.equipoLocal = equipo.equipo;
      this.escudoLocal = equipo.escudo;
    } else if (this.tipoSelecEquipo == 'visitante') {
      this.equipoVisitante = equipo.equipo;
      this.escudoVisitante = equipo.escudo;
    }

    this.buscarEquipo = '';
    this.listaEquiposFiltrada = this.listaEquipos;

    this.selecEquipo = false;
  }
}
