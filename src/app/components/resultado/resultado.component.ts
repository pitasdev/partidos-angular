import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [],
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
}
