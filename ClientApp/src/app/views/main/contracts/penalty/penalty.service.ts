import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Multa } from 'src/app/model.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PenaltyService {

  urlMulta = environment.apiURL +'Multa';
  urlMultaView = environment.apiURL +'MultaView';

  constructor(private http: HttpClient) {
   }

  /**
   * Metodos con la vista
   * @param id del contrato
   */
   // Metodo para traer una lista de garantias por idContrato
  public getMultasByContrato(id: string): Observable<any> {
    return this.http.get<any>(this.urlMultaView + "/" + id, { withCredentials : true });       
  }

  /**
   * Metodos con el controlador
   */
  // Metodo para traer una lista de Multas
  public getMultas(): Observable<Multa[]> {
    return this.http.get<Multa[]>(this.urlMulta, { withCredentials : true });
  }  
  
  public getMultaDetalle(id: string): Observable<any> {
    return this.http.get<any>(this.urlMulta + "/" + id, { withCredentials : true });
  }

  // Metodo para Insertar Nueva Multa
  public postMulta(data: Multa): Observable<Multa>{
    return this.http.post<Multa>(this.urlMulta, data, { withCredentials : true });
  }

  // Metodo para modificar garantia
  public putMulta(data: Multa): Observable<Multa> {
    return this.http.put<Multa>(this.urlMulta + '/' + data.ID, data);
  }
}