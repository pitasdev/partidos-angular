import { Component, Input, OnInit, inject } from '@angular/core';
import { Gol } from '../../interfaces/Gol';
import { Tarjeta } from '../../interfaces/Tarjeta';
import { TipoEquipo } from '../../interfaces/TipoEquipo';
import { ModalConfirmacionComponent } from '../modal-confirmacion/modal-confirmacion.component';
import { ClickDirective } from '../../directives/click.directive';
import { AppDataService } from '../../services/app-data.service';
import { ModalSumarComponent } from '../modal-sumar/modal-sumar.component';
import { ModalRestarComponent } from '../modal-restar/modal-restar.component';
import { TipoDato } from '../../interfaces/TipoDato';
import { Datos } from '../../interfaces/Datos';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [ModalConfirmacionComponent, ClickDirective, ModalSumarComponent, ModalRestarComponent],
  templateUrl: './info.component.html'
})
export class InfoComponent implements OnInit {
  @Input() tipoEquipo!: TipoEquipo;
  goles: Gol[] = [];
  tarjetas: Tarjeta[] = [];

  openModalConfirmacion: boolean = false;
  mensajeConfirmacion: string = '';
  id: string = '';
  openModalSumar: boolean = false;
  modalTipoEquipo!: TipoEquipo;
  modalTipoDato: TipoDato = 'tarjeta';

  appDataService = inject(AppDataService);

  ngOnInit(): void {
    this.appDataService.appData$.subscribe(data => {
      if (this.tipoEquipo == 'local') {
        this.goles = data.local.listaGoles;
        this.tarjetas = data.local.listaTarjetas;
      } else if (this.tipoEquipo == 'visitante') {
        this.goles = data.visitante.listaGoles;
        this.tarjetas = data.visitante.listaTarjetas;
      }
    })
  }

  anadirTarjeta(): void {
    this.modalTipoEquipo = this.tipoEquipo;
    this.openModalSumar = true;
  }

  confirmacionEliminar(event: Event): void {
    this.id = (event.currentTarget as HTMLElement).id;

    const splitID: string[] = this.id.split('-');
    this.mensajeConfirmacion = `¿Está seguro/a que quiere eliminar la <b>${splitID[1]} ${splitID[4]}</b> del equipo <b>${splitID[0]}</b> en el <b>minuto ${splitID[2]}</b> del <b>jugador número ${splitID[3]}</b>?`;
    this.openModalConfirmacion = true;
  }

  eliminar(event: Boolean): void {
    this.openModalConfirmacion = false;

    if (!event) return;

    const i: number = this.tarjetas.findIndex(tarjeta => tarjeta.id == this.id);

    if (i != -1) {
      this.tarjetas.splice(i, 1);
    }
  }

  guardarTarjeta(event: Datos | null): void {
    if (event?.tipoEquipo == 'local' && event.tipoDato == 'tarjeta') this.appDataService.agregarTarjeta({ id: event.id, dorsal: event.dorsal, minuto: event.minuto, color: event.tarjeta! }, 'local');
    else if (event?.tipoEquipo == 'visitante' && event.tipoDato == 'tarjeta') this.appDataService.agregarTarjeta({ id: event.id, dorsal: event.dorsal, minuto: event.minuto, color: event.tarjeta! }, 'visitante');

    this.openModalSumar = false;
  }

  eliminarTarjeta(event: boolean): void {
    this.openModalConfirmacion = false;

    if (event) {
      const splitID: string[] = this.id.split('-');
      
      if (splitID[0] == 'local' && splitID[1] == 'tarjeta') this.appDataService.quitarTarjeta(this.id, 'local'); 
      else if (splitID[0] == 'visitante' && splitID[1] == 'tarjeta') this.appDataService.quitarTarjeta(this.id, 'visitante');
    }
  }
}
