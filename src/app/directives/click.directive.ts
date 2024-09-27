import { AnimationBuilder, animate, style } from '@angular/animations';
import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { transform } from 'html2canvas/dist/types/css/property-descriptors/transform';

@Directive({
  selector: '[clickAnimation]',
  standalone: true
})
export class ClickDirective {
  elementRef: ElementRef = inject(ElementRef);
  builder: AnimationBuilder = inject(AnimationBuilder);

  private player = this.builder.build([
    style({ scale: '1', opacity: '1' }),
    animate('50ms', style({ scale: '0.85', opacity: '0.7' })),
    animate('100ms', style({ scale: '1', opacity: '1' }))
  ]).create(this.elementRef.nativeElement);

  private playAnimation(): void {
    this.player.play();

    setTimeout(() => {
      this.player.reset();
    }, 150);
  }

  @HostListener('click')
  onClick(): void {
    this.playAnimation();
  }
}
