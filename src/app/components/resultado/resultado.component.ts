import { Component, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Estado } from '../../interfaces/Estado';
import { AppDataService } from '../../services/app-data.service';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './resultado.component.html',
  styleUrl: './resultado.component.css'
})
export class ResultadoComponent implements OnInit, OnChanges {
  estado!: Estado;
  parte: number = 1;
  equipoLocal: string = 'Local';
  equipoVisitante: string = 'Visitante';
  resultadoLocal: number = 0;
  resultadoVisitante: number = 0;
  escudoLocal: string = '';
  escudoVisitante: string = '';

  appDataService = inject(AppDataService);

  ngOnInit(): void {
    this.appDataService.appData$.subscribe(data => {
      this.estado = data.estado;
      this.parte = data.parte;
      this.equipoLocal = data.local.equipo;
      this.equipoVisitante = data.visitante.equipo;
      this.resultadoLocal = data.local.goles;
      this.resultadoVisitante = data.visitante.goles;
      this.escudoLocal = data.local.escudo;
      this.escudoVisitante = data.visitante.escudo;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['escudoLocal']) {
      if (this.escudoLocal == '') {
        this.escudoLocal = 'default.png';
      }
    }

    if (changes['escudoVisitante']) {
      if (this.escudoVisitante == '') {
        this.escudoVisitante = 'default.png';
      }
    }
  }

  cambiarParte(): void {
    this.appDataService.setParte(this.parte);
  }
}
