import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirmacion',
  standalone: true,
  imports: [],
  templateUrl: './modal-confirmacion.component.html',
  styleUrl: './modal-confirmacion.component.css'
})
export class ModalConfirmacionComponent {
  @Input() mensaje: string = '';

  @Output() eventoConfirmar = new EventEmitter<boolean>();

  continuar(): void {
    this.eventoConfirmar.emit(true);
  }

  cancelar(): void {
    this.eventoConfirmar.emit(false);
  }
}
