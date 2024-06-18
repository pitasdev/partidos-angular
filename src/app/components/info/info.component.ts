import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Gol } from '../interfaces/Gol';
import { Tarjeta } from '../interfaces/Tarjeta';
import { TipoEquipo } from '../interfaces/TipoEquipo';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { ClickDirective } from '../../directives/click.directive';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [ModalConfirmacionComponent, ClickDirective],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  @Input() tipoEquipo!: TipoEquipo;
  @Input() goles: Gol[] = [];
  @Input() tarjetas: Tarjeta[] = [];

  openModalConfirmacion: boolean = false;
  mensajeConfirmacion: string = '';
  eliminarTarjetaID: string = '';

  @Output() eventoAnadirTarjeta = new EventEmitter<TipoEquipo>();

  anadirTarjeta(): void {
    this.eventoAnadirTarjeta.emit(this.tipoEquipo);
  }

  confirmacionEliminar(event: Event): void {
    this.eliminarTarjetaID = (event.currentTarget as HTMLElement).id;
    
    const splitID: string[] = this.eliminarTarjetaID.split('-');
    this.mensajeConfirmacion = `¿Está seguro/a que quiere eliminar la <b>${splitID[1]} ${splitID[4]}</b> del equipo <b>${splitID[0]}</b> en el minuto <b>${splitID[2]}</b> del jugador número <b>${splitID[3]}</b>?`;
    this.openModalConfirmacion = true;
  }

  eliminar(event: Boolean): void {
    this.openModalConfirmacion = false;

    if (!event) return;

    const i: number = this.tarjetas.findIndex(tarjeta => tarjeta.id == this.eliminarTarjetaID);

    if (i != -1) {
      this.tarjetas.splice(i, 1);
    }
  }
}
