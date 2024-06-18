import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { Estado } from '../interfaces/Estado';
import { EstadoService } from '../../services/estado.service';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { ClickDirective } from '../../directives/click.directive';

@Component({
  selector: 'app-tiempo',
  standalone: true,
  imports: [ModalConfirmacionComponent, ClickDirective],
  templateUrl: './tiempo.component.html',
  styleUrl: './tiempo.component.css'
})
export class TiempoComponent implements OnInit {
  estado!: Estado;
  tiempo: string = '00:00';
  interval!: any;

  openModalConfirmacion: boolean = false;
  mensajeConfirmacion: string = '';
  accionARealizar: string = '';
  estadoService = inject(EstadoService);

  @Output() eventoReiniciar = new EventEmitter();


  ngOnInit(): void {
    this.estadoService.estadoActual.subscribe(estadoActual => { this.estado = estadoActual; });
  }

  iniciarTiempo(): void {
    if (this.estado == 'play') return;

    this.estadoService.actualizarEstado('play');

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
    this.estadoService.actualizarEstado('stop');
  }

  reiniciarTiempo(): void {
    if (this.estado == 'play') return;

    this.tiempo = '00:00';
    this.estadoService.actualizarEstado('reset');
  }

  reiniciarTodo(): void {
    if (this.estado == 'play') return;

    this.tiempo = '00:00';
    this.estadoService.actualizarEstado('fullReset');

    this.eventoReiniciar.emit();
  }

  confirmarAccion(accion: string): void {
    if (this.estado == 'play') return;

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
