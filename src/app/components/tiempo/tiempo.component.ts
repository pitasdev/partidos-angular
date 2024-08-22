import { Component, OnInit, inject } from '@angular/core';
import { Estado } from '../../interfaces/Estado';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { ClickDirective } from '../../directives/click.directive';
import { AppDataService } from '../../services/app-data.service';
import { RecargaPaginaService } from '../../services/recarga-pagina.service';

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
  tiempoInicio!: number;
  tiempoActual!: number;
  tiempoEnSegundos: number = 0;

  openModalConfirmacion: boolean = false;
  mensajeConfirmacion: string = '';
  accionARealizar: string = '';

  appDataService = inject(AppDataService);
  recargaPaginaService = inject(RecargaPaginaService);

  ngOnInit(): void {
    this.appDataService.appData$.subscribe(data => {
      this.estado = data.estado;
      this.tiempo = data.tiempo;

      if (this.tiempo == '00:00') this.tiempoEnSegundos = 0;
    })

    this.recargaPaginaService.recarga$.subscribe(data => {
      if (data) this.tiempoEnSegundos = this.tiempoASegundos(this.tiempo);
    })
  }

  iniciarTiempo(): void {
    if (this.estado == 'play') return;

    this.appDataService.setEstado('play');
    this.tiempoInicio = Math.floor(new Date().getTime() / 1000);

    this.interval = setInterval(() => {
      this.sumarSegundo();
    }, 1000)
  }

  sumarSegundo(): void {
    this.tiempoActual = Math.floor(new Date().getTime() / 1000);

    const sumaTiempo = this.tiempoEnSegundos + (this.tiempoActual - this.tiempoInicio);
    let minutos = Math.floor(sumaTiempo / 60);
    let segundos = sumaTiempo % 60;
    
    if (minutos > 99) {
      minutos = 0;
      segundos = 0;
      this.tiempoEnSegundos = 0;
      this.tiempoInicio = Math.floor(new Date().getTime() / 1000);
    } 

    let tiempo: string;

    if (minutos < 10 && segundos < 10) tiempo = `0${minutos}:0${segundos}`;
    else if (minutos < 10) tiempo = `0${minutos}:${segundos}`;
    else if (segundos < 10) tiempo = `${minutos}:0${segundos}`;
    else tiempo = `${minutos}:${segundos}`;

    this.appDataService.setTiempo(tiempo);
  }

  pararTiempo(): void {
    this.tiempoEnSegundos = this.tiempoASegundos(this.tiempo);

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

  tiempoASegundos(tiempo: string): number {
    const splitTiempo: string[] = tiempo.split(':');
    const segundos: number = Number(splitTiempo[1]);
    const minutos: number = Number(splitTiempo[0]);

    return (minutos * 60) + segundos;
  }
}
