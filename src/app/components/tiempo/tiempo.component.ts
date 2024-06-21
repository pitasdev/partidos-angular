import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EstadoTiempo } from '../interfaces/EstadoTiempo';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { ClickDirective } from '../../directives/click.directive';

@Component({
  selector: 'app-tiempo',
  standalone: true,
  imports: [ModalConfirmacionComponent, ClickDirective],
  templateUrl: './tiempo.component.html',
  styleUrl: './tiempo.component.css'
})
export class TiempoComponent {
  @Input() estadoTiempo!: EstadoTiempo;
  tiempo: string = '00:00';
  interval!: any;

  openModalConfirmacion: boolean = false;
  mensajeConfirmacion: string = '';
  accionARealizar: string = '';

  @Output() eventoReiniciar = new EventEmitter();
  @Output() eventoCambiarEstadoTiempo = new EventEmitter<EstadoTiempo>();

  iniciarTiempo(): void {
    if (this.estadoTiempo == 'play') return;

    this.eventoCambiarEstadoTiempo.emit('play');

    this.interval = setInterval(() => {
      this.sumarSegundo();
    }, 1000)
  }

  sumarSegundo(): void {
    const splitTiempo: string[] = this.tiempo.split(':');
    let segundo: number = Number(splitTiempo[1]) + 1;
    let minuto: number = Number(splitTiempo[0]);

    if (segundo == 60) {
      segundo = 0;
      minuto++;
    }

    if (minuto == 100) {
      this.tiempo = '00:00';
      return;
    }

    splitTiempo[1] = segundo.toString();
    splitTiempo[0] = minuto.toString();

    if (segundo < 10) splitTiempo[1] = '0' + segundo;
    if (minuto < 10) splitTiempo[0] = '0' + minuto;

    this.tiempo = splitTiempo.join(':');
  }

  pararTiempo(): void {
    clearInterval(this.interval);
    this.eventoCambiarEstadoTiempo.emit('stop');
  }

  reiniciarTiempo(): void {
    if (this.estadoTiempo == 'play') return;

    this.tiempo = '00:00';
    this.eventoCambiarEstadoTiempo.emit('reset');
  }

  reiniciarTodo(): void {
    if (this.estadoTiempo == 'play') return;

    this.tiempo = '00:00';
    this.eventoCambiarEstadoTiempo.emit('fullReset');

    this.eventoReiniciar.emit();
  }

  confirmarAccion(accion: string): void {
    if (this.estadoTiempo == 'play') return;

    this.accionARealizar = accion;

    if (accion == 'click') this.mensajeConfirmacion = '¿Está seguro/a que quiere reiniciar el <b>tiempo</b>?';
    else if (accion == 'dblclick') this.mensajeConfirmacion = '¿Está seguro/a que quiere reiniciar <b>todos los parametros</b>?';

    setTimeout(() => {
      this.openModalConfirmacion = true;
    }, 150)
  }

  realizarAccion(event: boolean): void {
    this.openModalConfirmacion = false;

    if (!event) return;

    if (this.accionARealizar == 'click') this.reiniciarTiempo();
    else if (this.accionARealizar == 'dblclick') this.reiniciarTodo();
  }
}
