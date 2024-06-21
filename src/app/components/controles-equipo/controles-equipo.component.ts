import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TipoEquipo } from '../interfaces/TipoEquipo';
import { ClickDirective } from '../../directives/click.directive';

@Component({
  selector: 'app-controles-equipo',
  standalone: true,
  imports: [ClickDirective],
  templateUrl: './controles-equipo.component.html',
  styleUrl: './controles-equipo.component.css'
})
export class ControlesEquipoComponent {
  @Input() tipoEquipo!: TipoEquipo;

  @Output() eventoSumarGol = new EventEmitter<TipoEquipo>();
  @Output() eventoRestarGol = new EventEmitter<TipoEquipo>();
  @Output() eventoSumarFalta = new EventEmitter<TipoEquipo>();
  @Output() eventoRestarFalta = new EventEmitter<TipoEquipo>();

  sumarGol(): void {
    this.eventoSumarGol.emit(this.tipoEquipo);
  }

  restarGol(): void {
    this.eventoRestarGol.emit(this.tipoEquipo);
  }

  sumarFalta(): void {
    this.eventoSumarFalta.emit(this.tipoEquipo);
  }

  restarFalta(): void {
    this.eventoRestarFalta.emit(this.tipoEquipo);
  }
}
