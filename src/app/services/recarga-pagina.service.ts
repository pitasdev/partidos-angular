import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecargaPaginaService {
  private _recarga = new BehaviorSubject<boolean>(false);
  recarga$ = this._recarga.asObservable();

  recargaTrue(): void {
    this._recarga.next(true);
  }
}
