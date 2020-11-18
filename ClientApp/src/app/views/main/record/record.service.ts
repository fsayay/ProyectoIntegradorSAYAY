import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Historial } from 'src/app/model.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  urlHistorial = environment.apiURL + 'Historial';

  constructor(private http: HttpClient) {
   }

   // Metodo para obtener un Contrato
  public getHistorialByContrato(id: string): Observable<Historial>{
    const url = this.urlHistorial + "/" +id;
    return this.http.get<Historial>(url, { withCredentials : true });
  }

  // Metodo para obtener todo el historial de todos los contratos
  public getHistorial(): Observable<Historial>{
    return this.http.get<Historial>(this.urlHistorial, { withCredentials : true });
  }

  // Metodo para Insertar Nueva Garantia
  public postHistorial(data: Historial): Observable<Historial>{
    return this.http.post<Historial>(this.urlHistorial, data, { withCredentials : true });
  }

  // Metodo para modificar garantia
  public putHistorial(data: Historial): Observable<Historial> {
    return this.http.put<Historial>(this.urlHistorial + '/' + data.ID, data, { withCredentials : true });
  }

}

