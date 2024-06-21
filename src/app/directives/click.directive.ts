import { AnimationBuilder, animate, style } from '@angular/animations';
import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[clickAnimation]',
  standalone: true
})
export class ClickDirective {
  elementRef: ElementRef = inject(ElementRef);
  builder: AnimationBuilder = inject(AnimationBuilder);

  private player = this.builder.build([
    style({ transform: 'scale(1)', opacity: '1' }),
    animate('50ms', style({ transform: 'scale(0.85)', opacity: '0.7' })),
    animate('100ms', style({ transform: 'scale(1)', opacity: '1' }))
  ]).create(this.elementRef.nativeElement);

  private playAnimation(): void {
    this.player.play();

    setTimeout(() => {
      this.player.reset();
    }, 150);
  }

  @HostListener('click') onClick(): void {
    this.playAnimation();
  }
}
