import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { TipoDato } from '../../interfaces/TipoDato';
import { TipoEquipo } from '../../interfaces/TipoEquipo';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { AppDataService } from '../../services/app-data.service';
import { Gol } from '../../interfaces/Gol';

@Component({
  selector: 'app-modal-restar',
  standalone: true,
  imports: [ModalConfirmacionComponent],
  templateUrl: './modal-restar.component.html'
})
export class ModalRestarComponent implements OnInit {
  @Input() tipoEquipo!: TipoEquipo;
  @Input() tipoDato!: TipoDato;
  listaGoles: Gol[] = [];
  nombreEquipo!: string;

  openModalConfirmacion: boolean = false;
  mensajeConfirmacion: string = '';
  id: string = '';

  appDataService = inject(AppDataService);

  @Output() eventoEliminar = new EventEmitter<string | null>();

  ngOnInit(): void {
    this.appDataService.appData$.subscribe(data => {
      if (this.tipoEquipo == 'local') {
        this.listaGoles = data.local.listaGoles;
        this.nombreEquipo = data.local.equipo;
      } else if (this.tipoEquipo == 'visitante') {
        this.listaGoles = data.visitante.listaGoles;
        this.nombreEquipo = data.visitante.equipo;
      }
    })
  }

  confirmacionEliminar(event: Event): void {
    this.id = (event.currentTarget as HTMLElement).id;
    const splitID: string[] = this.id.split('-');

    this.openModalConfirmacion = true;
    this.mensajeConfirmacion = `¿Está seguro/a que quiere eliminar el <b>${splitID[1]}</b> del <b>${this.nombreEquipo}</b> en el <b>minuto ${splitID[2]}</b>`;

    if (splitID[3] != 'undefined') this.mensajeConfirmacion += ` del <b>jugador número ${splitID[3]}</b>`;
    this.mensajeConfirmacion += '?';
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
