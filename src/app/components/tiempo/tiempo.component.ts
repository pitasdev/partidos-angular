import { Component, OnInit, inject } from '@angular/core';
import { Estado } from '../../interfaces/Estado';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { ClickDirective } from '../../directives/click.directive';
import { AppDataService } from '../../services/app-data.service';
import { RecargaPaginaService } from '../../services/recarga-pagina.service';
import { ModoTiempo } from '../../interfaces/ModoTiempo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tiempo',
  standalone: true,
  imports: [ModalConfirmacionComponent, ClickDirective, CommonModule],
  templateUrl: './tiempo.component.html'
})
export class TiempoComponent implements OnInit {
  estado!: Estado;
  tiempo: number = 0;
  minutosParte!: number;
  modoTiempo!: ModoTiempo;

  cronometro: string = '00:00';
  interval!: any;
  tiempoAcumulado: number = 0;
  timestampInicio!: number;
  timestampActual!: number;
  limiteTiempo: boolean = false;

  openModalConfirmacion: boolean = false;
  mensajeConfirmacion: string = '';
  accionARealizar: string = '';

  appDataService = inject(AppDataService);
  recargaPaginaService = inject(RecargaPaginaService);

  ngOnInit(): void {
    this.appDataService.appData$.subscribe(data => {
      this.estado = data.estado;
      this.tiempo = data.tiempo;
      this.minutosParte = data.minutosParte;
      this.modoTiempo = data.modoTiempo;

      this.cronometro = this.setCronometro(this.tiempo);

      if (data.estado == 'configuracion') {
        this.tiempoAcumulado = 0;
        this.limiteTiempo = false;
      }
    })

    this.recargaPaginaService.recarga$.subscribe(data => {
      if (data) this.tiempoAcumulado = this.tiempo;
    })
  }

  iniciarTiempo(): void {
    if (this.estado == 'play') return;

    this.appDataService.setEstado('play');
    this.timestampInicio = Math.floor(new Date().getTime() / 1000);

    if (this.modoTiempo == 'descendente') this.tiempoAcumulado = this.tiempo;

    this.interval = setInterval(() => {
      this.modoTiempo == 'ascendente' ? this.sumarSegundo() : this.restarSegundo();
    }, 1000)
  }

  sumarSegundo(): void {
    if (this.tiempo >= 5999) {
      clearInterval(this.interval);
      return;
    }

    this.timestampActual = Math.floor(new Date().getTime() / 1000);

    const sumaTiempo: number = this.tiempoAcumulado + (this.timestampActual - this.timestampInicio);

    if (sumaTiempo >= this.minutosParte * 60) this.limiteTiempo = true;

    this.appDataService.setTiempo(sumaTiempo);
  }

  restarSegundo(): void {
    if (this.tiempo <= 0) {
      clearInterval(this.interval);
      return;
    }

    this.timestampActual = Math.floor(new Date().getTime() / 1000);

    const restaTiempo = this.tiempoAcumulado - (this.timestampActual - this.timestampInicio);

    if (restaTiempo <= 0) this.limiteTiempo = true;

    this.appDataService.setTiempo(restaTiempo);
  }

  pararTiempo(): void {
    if (this.modoTiempo == 'ascendente') this.tiempoAcumulado = this.tiempo;

    clearInterval(this.interval);
    this.appDataService.setEstado('stop');
  }

  reiniciarTiempo(): void {
    if (this.estado == 'play') return;

    if (this.modoTiempo == 'ascendente') {
      this.appDataService.setTiempo(0);
      this.tiempoAcumulado = 0;
    } else {
      this.appDataService.setTiempo(this.minutosParte * 60);
      this.tiempoAcumulado = this.minutosParte * 60;
    }

    this.limiteTiempo = false;

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

  setCronometro(tiempo: number): string {
    const minutos: number = Math.floor(tiempo / 60);
    const segundos: number = tiempo % 60;

    if (minutos < 10 && segundos < 10) return `0${minutos}:0${segundos}`;
    else if (minutos < 10) return `0${minutos}:${segundos}`;
    else if (segundos < 10) return `${minutos}:0${segundos}`;
    else return `${minutos}:${segundos}`;
  }
}
