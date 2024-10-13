import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { AppDataService } from '../../services/app-data.service';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Gol } from '../../interfaces/Gol';
import { Tarjeta } from '../../interfaces/Tarjeta';
import { CommonModule } from '@angular/common';
import { JugadoresService } from '../../services/jugadores.service';
import { Jugador } from '../../interfaces/Jugador';
import { TipoPersona } from '../../interfaces/TipoPersona';
import { TipoEquipo } from '../../interfaces/TipoEquipo';

@Component({
  selector: 'app-pdf-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf-page.component.html'
})
export class PdfPageComponent implements OnInit, AfterViewInit {
  equipoLocal: string = '';
  escudoLocal: string = '';
  golesLocal: number = 0;
  faltasParte1Local: number = 0;
  faltasParte2Local: number = 0;
  listaGolesLocal: Gol[] = [];
  listaTarjetasLocal: Tarjeta[] = [];

  equipoVisitante: string = '';
  escudoVisitante: string = '';
  golesVisitante: number = 0;
  faltasParte1Visitante: number = 0;
  faltasParte2Visitante: number = 0;
  listaGolesVisitante: Gol[] = [];
  listaTarjetasVisitante: Tarjeta[] = [];

  listaJugadoresLocal: Jugador[] = [];
  listaJugadoresVisitante: Jugador[] = [];

  appDataService = inject(AppDataService);
  jugadoresService = inject(JugadoresService);
  router = inject(Router);

  ngOnInit(): void {
    this.appDataService.appData$.subscribe(data => {
      this.equipoLocal = data.local.equipo;
      this.escudoLocal = data.local.escudo;
      this.golesLocal = data.local.goles;
      this.faltasParte1Local = data.local.faltasParte1;
      this.faltasParte2Local = data.local.faltasParte2;
      this.listaGolesLocal = data.local.listaGoles;
      this.listaTarjetasLocal = data.local.listaTarjetas;
      this.equipoVisitante = data.visitante.equipo;
      this.escudoVisitante = data.visitante.escudo;
      this.golesVisitante = data.visitante.goles;
      this.faltasParte1Visitante = data.visitante.faltasParte1;
      this.faltasParte2Visitante = data.visitante.faltasParte2;
      this.listaGolesVisitante = data.visitante.listaGoles;
      this.listaTarjetasVisitante = data.visitante.listaTarjetas;
    })

    this.jugadoresService.listaJugadores$.subscribe(data => {
      this.listaJugadoresLocal = data.local;
      this.listaJugadoresVisitante = data.visitante;
    })
  }
  
  ngAfterViewInit(): void {
    const pdfElement = document.getElementById('pdf') as HTMLElement;

    html2canvas(pdfElement, { scale: 3 }).then((canvas) => {
      const pdf = new jsPDF();
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 42.5, 10, 125, 90);

      pdf.save(`${this.equipoLocal} - ${this.equipoVisitante}`);
    })

    this.router.navigate(['']);
  }

  obtenerNombreJugador(dorsal: number | TipoPersona, tipoEquipo: TipoEquipo): string {
    switch (dorsal) {
      case 'E':
        return 'Entrenador';
      case '2E':
        return '2º Entrenador';
      case 'D':
        return 'Delegado';
      case 'A':
        return 'Auxiliar'
      default:
        let existeDorsal;

        if (tipoEquipo == 'local') existeDorsal = this.listaJugadoresLocal.find(jugador => dorsal == jugador.dorsal);
        else if (tipoEquipo == 'visitante') existeDorsal = this.listaJugadoresVisitante.find(jugador => dorsal == jugador.dorsal);
    
        if (existeDorsal) return existeDorsal.nombre;
        else return dorsal?.toString();
    }
  }
}
