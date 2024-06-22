import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Equipo } from '../interfaces/Equipo';
import { TipoEquipo } from '../interfaces/TipoEquipo';

@Component({
  selector: 'app-modal-configurar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal-configurar.component.html',
  styleUrl: './modal-configurar.component.css'
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
      escudoLocal: this.escudoLocal,
      escudoVisitante: this.escudoVisitante
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
