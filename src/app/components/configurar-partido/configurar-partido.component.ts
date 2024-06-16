import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { ModalConfigurarComponent } from '../modal-configurar/modal-configurar.component';
import { EquiposService } from '../../services/equipos.service';
import { Equipo } from '../interfaces/Equipo';

@Component({
  selector: 'app-configurar-partido',
  standalone: true,
  imports: [ModalConfigurarComponent],
  templateUrl: './configurar-partido.component.html',
  styleUrl: './configurar-partido.component.css'
})
export class ConfigurarPartidoComponent implements OnInit {
  listaEquipos: Equipo[] = [];
  modalConfigurar: boolean = false;

  equiposService = inject(EquiposService);

  @Output() eventoConfigurar = new EventEmitter();

  ngOnInit(): void {
    this.equiposService.getEquipos().subscribe(
      data => {
        this.listaEquipos = data;

        this.listaEquipos.sort((a, b) => {
          if (a.equipo > b.equipo) return 1;
          else if (a.equipo < b.equipo) return -1;
          else return 0;
        });
      });
  }

  mostrarModalConfigurar(): void {
    this.modalConfigurar = true;
  }

  configurar(event: any): void {
    if (event) {
      this.eventoConfigurar.emit(event);
    }

    this.modalConfigurar = false;
  }
}
