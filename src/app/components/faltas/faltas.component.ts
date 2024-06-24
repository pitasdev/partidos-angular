import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { TipoEquipo } from '../../interfaces/TipoEquipo';
import { CommonModule } from '@angular/common';
import { AppDataService } from '../../services/app-data.service';

@Component({
  selector: 'app-faltas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faltas.component.html',
  styleUrl: './faltas.component.css'
})
export class FaltasComponent implements OnInit, AfterViewInit {
  @Input() tipoEquipo!: TipoEquipo;
  numFaltas: number = 0;
  parte: number = 1;

  componenteCargado: boolean = false;

  appDataService = inject(AppDataService);
  renderer = inject(Renderer2);

  @ViewChild('falta1') falta1!: ElementRef;
  @ViewChild('falta2') falta2!: ElementRef;
  @ViewChild('falta3') falta3!: ElementRef;
  @ViewChild('falta4') falta4!: ElementRef;
  @ViewChild('falta5') falta5!: ElementRef;

  ngOnInit(): void {
    this.appDataService.appData$.subscribe(data => {
      this.parte = data.parte;

      if (this.tipoEquipo == 'local') {
        if (this.parte == 1) this.numFaltas = data.local.faltasParte1;
        else if (this.parte == 2) this.numFaltas = data.local.faltasParte2;
      } else if (this.tipoEquipo == 'visitante') {
        if (this.parte == 1) this.numFaltas = data.visitante.faltasParte1;
        else if (this.parte == 2) this.numFaltas = data.visitante.faltasParte2;
      }

      this.comprobarFaltas();
    })
  }

  ngAfterViewInit(): void {
    this.componenteCargado = true;
    this.comprobarFaltas();
  }

  comprobarFaltas(): void {
    if (this.componenteCargado) {
      switch (this.numFaltas) {
        case 0:
          this.renderer.removeClass(this.falta1.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta2.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta3.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta4.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta5.nativeElement, 'bg-red-600');
          break;
        case 1:
          this.renderer.addClass(this.falta1.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta2.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta3.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta4.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta5.nativeElement, 'bg-red-600');
          break;
        case 2:
          this.renderer.addClass(this.falta1.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta2.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta3.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta4.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta5.nativeElement, 'bg-red-600');
          break;
        case 3:
          this.renderer.addClass(this.falta1.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta2.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta3.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta4.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta5.nativeElement, 'bg-red-600');
          break;
        case 4:
          this.renderer.addClass(this.falta1.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta2.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta3.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta4.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta5.nativeElement, 'bg-red-600');
          break;
        case 5:
          this.renderer.addClass(this.falta1.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta2.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta3.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta4.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta5.nativeElement, 'bg-red-600');
          break;
      }
    }
  }
}
