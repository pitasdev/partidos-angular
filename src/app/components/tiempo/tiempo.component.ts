import { Component, OnInit, inject } from '@angular/core';
import { Estado } from '../../interfaces/Estado';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { ClickDirective } from '../../directives/click.directive';
import { AppDataService } from '../../services/app-data.service';

@Component({
  selector: 'app-tiempo',
  standalone: true,
  imports: [ModalConfirmacionComponent, ClickDirective],
  templateUrl: './tiempo.component.html'
})
export class TiempoComponent implements OnInit {
  estado!: Estado;
  tiempo: string = '00:00';
  interval!: any;

  openModalConfirmacion: boolean = false;
  mensajeConfirmacion: string = '';
  accionARealizar: string = '';

  appDataService = inject(AppDataService);

  ngOnInit(): void {
    this.appDataService.appData$.subscribe(data => {
      this.estado = data.estado;
      this.tiempo = data.tiempo;
    })
  }

  iniciarTiempo(): void {
    if (this.estado == 'play') return;

    this.appDataService.setEstado('play')

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
      this.appDataService.setTiempo('00:00');
      return;
    }

    splitTiempo[1] = segundo.toString();
    splitTiempo[0] = minuto.toString();

    if (segundo < 10) splitTiempo[1] = '0' + segundo;
    if (minuto < 10) splitTiempo[0] = '0' + minuto;

    this.tiempo = splitTiempo.join(':');

    this.appDataService.setTiempo(this.tiempo);
  }

  pararTiempo(): void {
    clearInterval(this.interval);
    this.appDataService.setEstado('stop');
  }

  reiniciarTiempo(): void {
    if (this.estado == 'play') return;

    this.appDataService.setTiempo('00:00');
    this.appDataService.setEstado('reset');
  }

  finalizarPartido(): void {
    if (this.estado == 'play') return;

    this.appDataService.setEstado('finalizado');
  }

  realizarAccion(event: boolean): void {
    this.openModalConfirmacion = false;

    if (!event) return;

    if (this.accionARealizar == 'reiniciarTiempo') this.reiniciarTiempo();
    else if (this.accionARealizar == 'finalizar') this.finalizarPartido();
  }

  confirmarReiniciarTiempo(): void {
    if (this.estado == 'play') return;

    this.accionARealizar = 'reiniciarTiempo';
    this.mensajeConfirmacion = '¿Está seguro/a que quiere <b>reiniciar el tiempo</b>?';
    this.openModalConfirmacion = true;
  }

  confirmarFinalizarPartido(): void {
    if (this.estado == 'play') return;

    this.accionARealizar = 'finalizar';
    this.mensajeConfirmacion = '¿Está seguro/a que quiere <b>finalizar el partido</b>?';
    this.openModalConfirmacion = true;
  }
}
