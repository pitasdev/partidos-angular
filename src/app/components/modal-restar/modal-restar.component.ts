import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TipoDato } from '../interfaces/TipoDato';
import { TipoEquipo } from '../interfaces/TipoEquipo';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';

@Component({
  selector: 'app-modal-restar',
  standalone: true,
  imports: [ModalConfirmacionComponent],
  templateUrl: './modal-restar.component.html',
  styleUrl: './modal-restar.component.css'
})
export class ModalRestarComponent {
  @Input() tipoDato!: TipoDato;
  @Input() tipoEquipo!: TipoEquipo;
  @Input() listaDatos: any[] = [];

  openModalConfirmacion: boolean = false;
  mensajeConfirmacion: string = '';
  eliminarGolID: string = '';

  @Output() eventoEliminar = new EventEmitter<string | null>();

  confirmacionEliminar(event:Event): void {
    this.eliminarGolID = (event.currentTarget as HTMLElement).id;
    
    const splitID: string[] = this.eliminarGolID.split('-');
    this.openModalConfirmacion = true;
    this.mensajeConfirmacion = `¿Está seguro/a que quiere eliminar el <b>${splitID[1]}</b> del equipo <b>${splitID[0]}</b> en el minuto <b>${splitID[2]}</b>`;
    if (splitID[3] != 'undefined') this.mensajeConfirmacion += ` del jugador <b>${splitID[3]}</b>`;
    this.mensajeConfirmacion += '?';
  }

  eliminar(event: boolean): void {
    this.openModalConfirmacion = false;

    if (!event) return;

    this.eventoEliminar.emit(this.eliminarGolID);
  }

  cancelar(): void {
    this.eventoEliminar.emit();
  }
}
