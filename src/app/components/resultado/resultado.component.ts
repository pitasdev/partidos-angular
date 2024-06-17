import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Estado } from '../interfaces/Estado';
import { EstadoService } from '../../services/estado.service';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './resultado.component.html',
  styleUrl: './resultado.component.css'
})
export class ResultadoComponent implements OnInit, OnChanges {
  @Input() equipoLocal: string = 'Local';
  @Input() equipoVisitante: string = 'Visitante';
  @Input() resultadoLocal: number = 0;
  @Input() resultadoVisitante: number = 0;
  @Input() escudoLocal: string = '';
  @Input() escudoVisitante: string = '';
  @Input() parte: number = 1;

  estado!: Estado;
  estadoService = inject(EstadoService);

  @Output() eventoCambiarParte = new EventEmitter<number>();

  ngOnInit(): void {
    this.estadoService.estadoActual.subscribe(estadoActual => this.estado = estadoActual);
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
    this.eventoCambiarParte.emit(this.parte);
  }
}
