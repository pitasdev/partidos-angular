import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Estado } from '../components/interfaces/Estado';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private estado: BehaviorSubject<Estado> = new BehaviorSubject<Estado>('fullReset');
  estadoActual = this.estado.asObservable();

  actualizarEstado(nuevoEstado: Estado): void {
    this.estado.next(nuevoEstado);
  }
}
