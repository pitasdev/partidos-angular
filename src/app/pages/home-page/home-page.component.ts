import { Component, OnInit, inject } from '@angular/core';
import { ControlesEquipoComponent } from '../../components/controles-equipo/controles-equipo.component';
import { TiempoComponent } from '../../components/tiempo/tiempo.component';
import { ResultadoComponent } from '../../components/resultado/resultado.component';
import { FaltasComponent } from '../../components/faltas/faltas.component';
import { InfoComponent } from '../../components/info/info.component';
import { ModalConfirmacionComponent } from '../../components/modal-confirmacion/modal-confirmacion.component';
import { ClickDirective } from '../../directives/click.directive';
import { Estado } from '../../interfaces/Estado';
import { Title } from '@angular/platform-browser';
import { AppDataService } from '../../services/app-data.service';
import { ModalConfigurarComponent } from '../../components/modal-configurar/modal-configurar.component';
import { Equipo } from '../../interfaces/Equipo';
import { EquiposService } from '../../services/equipos.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ControlesEquipoComponent, TiempoComponent, ResultadoComponent, FaltasComponent, InfoComponent, ModalConfirmacionComponent, ModalConfigurarComponent, ClickDirective],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  estado: Estado = 'configuracion';
  equipoLocal: string = 'Local';
  equipoVisitante: string = 'Visitante';
  listaEquipos: Equipo[] = [];

  openModalConfirmacion: boolean = false;
  mensajeConfirmacion: string = '';
  openModalConfigurar: boolean = false;

  appDataService = inject(AppDataService);
  equiposService = inject(EquiposService);
  title = inject(Title);

  ngOnInit(): void {
    this.appDataService.appData$.subscribe(data => {
      this.estado = data.estado;
      this.equipoLocal = data.local.equipo;
      this.equipoVisitante = data.visitante.equipo;
    })

   this.equiposService.getEquipos().subscribe(equipos => this.listaEquipos = equipos);
  }

  reiniciarData(event: boolean): void {
    this.openModalConfirmacion = false;

    if (!event) return;

    this.appDataService.resetData();
  }

  confirmarReiniciarPartido(): void {
    this.openModalConfirmacion = true;
    this.mensajeConfirmacion = '¿Está seguro/a que quiere <b>empezar un partido nuevo</b>?'
  }
  
  mostrarModalConfigurar(): void {
    this.openModalConfigurar = true;
  }
  
  configurarPartido(event: any): void {
    this.openModalConfigurar = false;

    this.appDataService.setDatosEquipo({ equipo: event.equipoLocal, escudo: event.escudoLocal }, 'local');
    this.appDataService.setDatosEquipo({ equipo: event.equipoVisitante, escudo: event.escudoVisitante }, 'visitante');
    this.appDataService.setEstado('reset');
  }
}
