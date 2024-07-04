import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Datos } from '../../interfaces/Datos';
import { TipoDato } from '../../interfaces/TipoDato';
import { TipoEquipo } from '../../interfaces/TipoEquipo';
import { AppDataService } from '../../services/app-data.service';
import { Estado } from '../../interfaces/Estado';

@Component({
  selector: 'app-modal-sumar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal-sumar.component.html'
})
export class ModalSumarComponent implements OnInit {
  @Input() tipoDato!: TipoDato;
  @Input() tipoEquipo!: TipoEquipo;

  minuto!: number;
  dorsal!: number;
  tarjeta: 'amarilla' | 'roja' = 'amarilla';
  estado!: Estado;
  tiempo!: string;

  appDataService = inject(AppDataService);

  @Output() eventoGuardar = new EventEmitter<Datos | null>();

  ngOnInit(): void {
    this.appDataService.appData$.subscribe(data => {
      this.estado = data.estado;
      this.tiempo = data.tiempo;

      if (this.estado == 'play' || this.tiempo != '00:00') {
        const splitTiempo: string[] = this.tiempo.split(':');
        this.minuto = Number(splitTiempo[0]) + 1;
      }
    })
  }

  guardar(): void {
    const datos: Datos = {
      id: `${this.tipoEquipo}-${this.tipoDato}-${this.minuto}-${this.dorsal}`,
      tipoEquipo: this.tipoEquipo,
      tipoDato: this.tipoDato,
      minuto: this.minuto,
      dorsal: this.dorsal
    }

    if (this.tipoDato == 'gol' && !this.minuto) return;

    if (this.tipoDato == 'tarjeta') {
      if (!this.minuto || !this.dorsal) return;

      datos.id += `-${this.tarjeta}`;
      datos.tarjeta = this.tarjeta;
    }

    this.eventoGuardar.emit(datos);
  }

  cancelar(): void {
    this.eventoGuardar.emit();
  }

  validarInput(valor: string): void {
    if (valor == 'minuto') {
      if (!this.minuto) return;
      if (this.minuto < 1) this.minuto = 1;
      if (this.minuto > 99) this.minuto = 99;
    } else if (valor == 'dorsal') {
      if (!this.dorsal) return;
      if (this.dorsal < 1) this.dorsal = 1;
      if (this.dorsal > 99) this.dorsal = 99;
    }
  }
}
