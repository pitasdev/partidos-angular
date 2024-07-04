import { Component, Input, OnInit, inject } from '@angular/core';
import { TipoEquipo } from '../../interfaces/TipoEquipo';
import { ClickDirective } from '../../directives/click.directive';
import { AppDataService } from '../../services/app-data.service';
import { ModalSumarComponent } from '../modal-sumar/modal-sumar.component';
import { ModalRestarComponent } from '../modal-restar/modal-restar.component';
import { TipoDato } from '../../interfaces/TipoDato';
import { Datos } from '../../interfaces/Datos';

@Component({
  selector: 'app-controles-equipo',
  standalone: true,
  imports: [ClickDirective, ModalSumarComponent, ModalRestarComponent],
  templateUrl: './controles-equipo.component.html'
})
export class ControlesEquipoComponent implements OnInit {
  @Input() tipoEquipo!: TipoEquipo;
  goles: number = 0;
  parte: number = 1;
  faltasParte1: number = 0;
  faltasParte2: number = 0;

  openModalSumar: boolean = false;
  openModalRestar: boolean = false;
  modalTipoEquipo!: TipoEquipo;
  modalTipoDato: TipoDato = 'gol';

  appDataService = inject(AppDataService);

  ngOnInit(): void {
    this.appDataService.appData$.subscribe(data => {
      this.parte = data.parte;

      if (this.tipoEquipo == 'local') {
        this.goles = data.local.goles;
        this.faltasParte1 = data.local.faltasParte1;
        this.faltasParte2 = data.local.faltasParte2
      } 
      else if (this.tipoEquipo == 'visitante') {
        this.goles = data.visitante.goles;
        this.faltasParte1 = data.visitante.faltasParte1;
        this.faltasParte2 = data.visitante.faltasParte2
      }
    })
  }

  sumarGol(): void {
    if (this.goles == 99) return;

    if (this.tipoEquipo == 'local') {
      this.openModalSumar = true;
      this.modalTipoEquipo = 'local';
    } else if (this.tipoEquipo == 'visitante') {
      this.openModalSumar = true;
      this.modalTipoEquipo = 'visitante';
    }
  }

  restarGol(): void {
    if (this.goles == 0) return;

    if (this.tipoEquipo == 'local') {
      this.openModalRestar = true;
      this.modalTipoEquipo = 'local';
    } else if (this.tipoEquipo == 'visitante') {
      this.openModalRestar = true;
      this.modalTipoEquipo = 'visitante';
    }
  }

  sumarFalta(): void {
    if (this.tipoEquipo == 'local' && this.parte == 1) {
      if (this.faltasParte1 == 5) return;
      this.appDataService.setDatosEquipo({ faltasParte1: this.faltasParte1 + 1 }, 'local');
    } else if (this.tipoEquipo == 'local' && this.parte == 2) {
      if (this.faltasParte2 == 5) return;
      this.appDataService.setDatosEquipo({ faltasParte2: this.faltasParte2 + 1 }, 'local');
    } else if (this.tipoEquipo == 'visitante' && this.parte == 1) {
      if (this.faltasParte1 == 5) return;
      this.appDataService.setDatosEquipo({ faltasParte1: this.faltasParte1 + 1 }, 'visitante');
    } else if (this.tipoEquipo == 'visitante' && this.parte == 2) {
      if (this.faltasParte2 == 5) return;
      this.appDataService.setDatosEquipo({ faltasParte2: this.faltasParte2 + 1 }, 'visitante');
    }
  }

  restarFalta(): void {
    if (this.tipoEquipo == 'local' && this.parte == 1) {
      if (this.faltasParte1 == 0) return;
      this.appDataService.setDatosEquipo({ faltasParte1: this.faltasParte1 - 1 }, 'local');
    } else if (this.tipoEquipo == 'local' && this.parte == 2) {
      if (this.faltasParte2 == 0) return;
      this.appDataService.setDatosEquipo({ faltasParte2: this.faltasParte2 - 1 }, 'local');
    } else if (this.tipoEquipo == 'visitante' && this.parte == 1) {
      if (this.faltasParte1 == 0) return;
      this.appDataService.setDatosEquipo({ faltasParte1: this.faltasParte1 - 1 }, 'visitante');
    } else if (this.tipoEquipo == 'visitante' && this.parte == 2) {
      if (this.faltasParte2 == 0) return;
      this.appDataService.setDatosEquipo({ faltasParte2: this.faltasParte2 - 1 }, 'visitante');
    }
  }

  guardarGol(event: Datos | null) {
    if (event?.tipoEquipo == 'local' && event.tipoDato == 'gol') {
      this.appDataService.agregarGol({ id: event.id, dorsal: event.dorsal, minuto: event.minuto }, 'local');
      this.appDataService.setDatosEquipo({ goles: this.goles + 1 }, 'local');
    } else if (event?.tipoEquipo == 'visitante' && event.tipoDato == 'gol') {
      this.appDataService.agregarGol({ id: event.id, dorsal: event.dorsal, minuto: event.minuto }, 'visitante');
      this.appDataService.setDatosEquipo({ goles: this.goles + 1 }, 'visitante');
    }

    this.openModalSumar = false;
  }

  eliminarGol(event: string | null): void {
    if (event) {
      const splitID: string[] = event.split('-');
      
      if (splitID[0] == 'local' && splitID[1] == 'gol'){
        this.appDataService.quitarGol(event, 'local');
        this.appDataService.setDatosEquipo({ goles: this.goles - 1 }, 'local');
      } 
      else if (splitID[0] == 'visitante' && splitID[1] == 'gol') {
        this.appDataService.quitarGol(event, 'visitante');
        this.appDataService.setDatosEquipo({ goles: this.goles - 1 }, 'visitante');
      } 
    }
    
    this.openModalRestar = false;
  }
}
