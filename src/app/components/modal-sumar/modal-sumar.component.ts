import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Datos } from '../../interfaces/Datos';
import { TipoDato } from '../../interfaces/TipoDato';
import { TipoEquipo } from '../../interfaces/TipoEquipo';
import { AppDataService } from '../../services/app-data.service';
import { CommonModule } from '@angular/common';
import { ModoTiempo } from '../../interfaces/ModoTiempo';
import { TipoPersona } from '../../interfaces/TipoPersona';
import { Jugador } from '../../interfaces/Jugador';
import { JugadoresService } from '../../services/jugadores.service';

@Component({
  selector: 'app-modal-sumar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-sumar.component.html'
})
export class ModalSumarComponent implements OnInit {
  @Input() tipoDato!: TipoDato;
  @Input() tipoEquipo!: TipoEquipo;

  minuto!: number;
  dorsal!: number;
  personaTarjeta: TipoPersona = 'J';
  tarjeta: 'amarilla' | 'roja' = 'amarilla';
  parte!: number;
  minutosParte!: number;
  modoTiempo!: ModoTiempo;
  dataService!: any;
  golEnPropia: boolean = false;
  autocalcularMinuto: boolean = true;
  jugador!: number;
  jugadores!: Jugador[];

  appDataService = inject(AppDataService);
  jugadoresService = inject(JugadoresService);

  @Output() eventoGuardar = new EventEmitter<Datos | null>();

  ngOnInit(): void {
    this.dataService = this.appDataService.appData$.subscribe(data => {
      this.parte = data.parte;
      this.minutosParte = data.minutosParte;
      this.modoTiempo = data.modoTiempo;

      if (this.modoTiempo == 'ascendente') {
        if (this.parte == 1 && data.tiempo != 0) this.minuto = Math.floor(data.tiempo / 60) + 1;
        else if (this.parte == 2 && data.tiempo != 0) this.minuto = Math.floor(data.tiempo / 60) + 1 + data.minutosParte;
      } else {
        if (this.parte == 1 && data.tiempo != this.minutosParte * 60) this.minuto = this.minutosParte - Math.floor(data.tiempo / 60);
        else if (this.parte == 2 && data.tiempo != this.minutosParte * 60) this.minuto = this.minutosParte - Math.floor(data.tiempo / 60) + Number(this.minutosParte);
      }
    }).unsubscribe();

    this.jugadoresService.listaJugadores$.subscribe(data => {
      if (this.tipoEquipo == 'local') this.jugadores = data.local;
      else if (this.tipoEquipo == 'visitante') this.jugadores = data.visitante;
    })

    const autocalcular: string | null = localStorage.getItem('autocalcularMinuto');

    if (autocalcular == 'true') this.autocalcularMinuto = true;
    else if (autocalcular == 'false') this.autocalcularMinuto = false;
  }

  guardar(): void {
    if (this.tipoDato == 'gol' && !this.minuto) return;

    const datos: Datos = {
      id: `${this.tipoEquipo}-${this.tipoDato}-${this.minuto}-${this.dorsal ?? this.jugador}`,
      tipoEquipo: this.tipoEquipo,
      tipoDato: this.tipoDato,
      minuto: this.minuto,
      dorsal: this.dorsal ?? this.jugador
    }

    if (this.golEnPropia){
      datos.id = `${this.tipoEquipo}-${this.tipoDato}-${this.minuto}-pp`;
      datos.dorsal = 'pp';
    } 

    if (this.tipoDato == 'tarjeta') {
      if (!this.minuto || (!this.dorsal && !this.jugador && this.personaTarjeta == 'J')) return;

      if (this.personaTarjeta != 'J') {
        datos.id = `${this.tipoEquipo}-${this.tipoDato}-${this.minuto}-${this.personaTarjeta}`;
        datos.dorsal = this.personaTarjeta;
      }

      datos.id += `-${this.tarjeta}`;
      datos.tarjeta = this.tarjeta;
    }

    this.eventoGuardar.emit(datos);
  }

  cancelar(): void {
    this.eventoGuardar.emit();
  }

  calcularMinuto(valor: Event): void {
    if (!this.minuto?.toString() || this.modoTiempo == 'ascendente' || !this.autocalcularMinuto) return;

    const valorInput: string = (valor.target as HTMLInputElement).value;

    if (this.parte == 1) this.minuto = this.minutosParte - Number(valorInput.slice(0, 2));
    else if (this.parte == 2) this.minuto = this.minutosParte - Number(valorInput.slice(0, 2)) + Number(this.minutosParte);
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

  setAutocalcularMinuto(): void {
    localStorage.setItem('autocalcularMinuto', this.autocalcularMinuto.toString());
  }
}
