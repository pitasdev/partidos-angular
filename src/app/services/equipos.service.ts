import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipo } from '../components/interfaces/Equipo';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {
  http: HttpClient = inject(HttpClient);

  getEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>('assets/equipos.json');
  }
}
