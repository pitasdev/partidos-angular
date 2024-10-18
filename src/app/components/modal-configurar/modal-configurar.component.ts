import { Component, ElementRef, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Equipo } from '../../interfaces/Equipo';
import { TipoEquipo } from '../../interfaces/TipoEquipo';
import { CommonModule } from '@angular/common';
import { ModoTiempo } from '../../interfaces/ModoTiempo';
import { EquiposService } from '../../services/equipos.service';

@Component({
  selector: 'app-modal-configurar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-configurar.component.html',
  styleUrl: './modal-configurar.component.css'
})
export class ModalConfigurarComponent implements OnInit {
  listaEquipos: Equipo[] = [];
  equipoLocal: string = '';
  equipoVisitante: string = '';
  escudoLocal: string = '';
  escudoVisitante: string = '';
  minutos: number = 25;
  modoTiempo: ModoTiempo = 'ascendente';

  equiposService = inject(EquiposService);

  @Output() eventoGuardar = new EventEmitter();

  @ViewChild('selecEquipo') inputSelecEquipo!: ElementRef;

  ngOnInit(): void {
    this.equiposService.getEquipos().subscribe(equipos => {
      this.listaEquipos = equipos;

      this.listaEquipos.sort((a, b) => {
        if (a.equipo > b.equipo) return 1;
        else if (a.equipo < b.equipo) return -1;
        else return 0;
      })
    });
  }

  seleccionarEquipo(event: Event, tipoEquipo: TipoEquipo): void {
    const equipoInput: string = (event.target as HTMLInputElement).value;
    const equipo = this.listaEquipos.find(e => e.equipo == equipoInput);

    if (tipoEquipo == 'local') {
      this.equipoLocal = equipo?.equipo ?? equipoInput;
      this.escudoLocal = equipo?.escudo ?? '';
    } else if (tipoEquipo == 'visitante') {
      this.equipoVisitante = equipo?.equipo ?? equipoInput;
      this.escudoVisitante = equipo?.escudo ?? '';
    }
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
}
