import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipo } from '../interfaces/Equipo';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {
  private _http: HttpClient = inject(HttpClient);

  getEquipos(): Observable<Equipo[]> {
    return this._http.get<Equipo[]>('assets/equipos.json');
  }
}
