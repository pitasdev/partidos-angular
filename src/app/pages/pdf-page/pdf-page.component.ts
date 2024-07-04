import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { AppDataService } from '../../services/app-data.service';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Gol } from '../../interfaces/Gol';
import { Tarjeta } from '../../interfaces/Tarjeta';
import { CommonModule } from '@angular/common';

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

  appDataService = inject(AppDataService);
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
  }
  
  ngAfterViewInit(): void {
    const pdfElement = document.getElementById('pdf') as HTMLElement;

    html2canvas(pdfElement, { scale: 3 }).then((canvas) => {
      const pdf = new jsPDF();
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 45, 10, 125, 90);

      pdf.save(`${this.equipoLocal} - ${this.equipoVisitante}`);
    })

    this.router.navigate(['']);
  }
}
