import { AfterViewInit, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, ViewChild, inject } from '@angular/core';
import { TipoEquipo } from '../interfaces/TipoEquipo';

@Component({
  selector: 'app-faltas',
  standalone: true,
  imports: [],
  templateUrl: './faltas.component.html',
  styleUrl: './faltas.component.css'
})
export class FaltasComponent implements AfterViewInit, OnChanges {
  @Input() tipoEquipo!: TipoEquipo;
  @Input() numFaltas: number = 0;

  renderer = inject(Renderer2);
  componenteCargado: boolean = false;

  @ViewChild('falta1') falta1!: ElementRef;
  @ViewChild('falta2') falta2!: ElementRef;
  @ViewChild('falta3') falta3!: ElementRef;
  @ViewChild('falta4') falta4!: ElementRef;
  @ViewChild('falta5') falta5!: ElementRef;

  ngAfterViewInit(): void {
    this.componenteCargado = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['numFaltas'] && this.componenteCargado) {
      switch (this.numFaltas) {
        case -1:
          this.renderer.removeClass(this.falta1.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta2.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta3.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta4.nativeElement, 'bg-red-600');
          this.renderer.removeClass(this.falta5.nativeElement, 'bg-red-600');
          break;
        case 0:
          this.renderer.removeClass(this.falta1.nativeElement, 'bg-red-600');
          break;
        case 1:
          this.renderer.addClass(this.falta1.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta1.nativeElement, 'bg-blue-600');
          this.renderer.removeClass(this.falta2.nativeElement, 'bg-red-600');
          break;
        case 2:
          this.renderer.addClass(this.falta2.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta2.nativeElement, 'bg-blue-600');
          this.renderer.removeClass(this.falta3.nativeElement, 'bg-red-600');
          break;
        case 3:
          this.renderer.addClass(this.falta3.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta3.nativeElement, 'bg-blue-600');
          this.renderer.removeClass(this.falta4.nativeElement, 'bg-red-600');
          break;
        case 4:
          this.renderer.addClass(this.falta4.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta4.nativeElement, 'bg-blue-600');
          this.renderer.removeClass(this.falta5.nativeElement, 'bg-red-600');
          break;
        case 5:
          this.renderer.addClass(this.falta5.nativeElement, 'bg-red-600');
          this.renderer.addClass(this.falta5.nativeElement, 'bg-blue-600');
          break;
      }
    }
  }
}
