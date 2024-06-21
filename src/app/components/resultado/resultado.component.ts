import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstadoTiempo } from '../interfaces/EstadoTiempo';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './resultado.component.html',
  styleUrl: './resultado.component.css'
})
export class ResultadoComponent implements OnChanges {
  @Input() equipoLocal: string = 'Local';
  @Input() equipoVisitante: string = 'Visitante';
  @Input() resultadoLocal: number = 0;
  @Input() resultadoVisitante: number = 0;
  @Input() escudoLocal: string = '';
  @Input() escudoVisitante: string = '';
  @Input() parte: number = 1;
  @Input() estadoTiempo!: EstadoTiempo;

  @Output() eventoCambiarParte = new EventEmitter<number>();

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
