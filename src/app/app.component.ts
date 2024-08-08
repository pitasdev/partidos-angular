import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppDataService } from './services/app-data.service';
import { ModalConfirmacionComponent } from './components/modal-confirmacion/modal-confirmacion.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalConfirmacionComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  modal: boolean = false;

  appDataService = inject(AppDataService);

  ngOnInit(): void {
    const createdAt = new Date(localStorage.getItem('createdAt')!);
    const fechaActual = new Date();
    const diferenciaHoras = (fechaActual.getTime() - createdAt.getTime()) / 1000 / 60 / 60;
    
    if (localStorage.getItem('partido') && diferenciaHoras < 12) this.modal = true;
  }

  respuestaModal(event: boolean): void {
    if (event) this.appDataService.cargarLocalStorage();

    this.modal = false;
  }
}
