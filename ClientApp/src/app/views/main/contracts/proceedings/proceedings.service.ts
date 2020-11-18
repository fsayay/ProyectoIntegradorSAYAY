import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Acta } from 'src/app/model.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProceedingsService {

  urlActa = environment.apiURL +'Acta';
  urlActaView = environment.apiURL +'ActaView';

  constructor(private http: HttpClient) { }

  /**
   * Metodos con la vista
   * @param id del contrato
   */
  // Metodo para traer una lista de garantias por idContrato
  public getActasByContrato(id: string): Observable<any> {
    return this.http.get<any>(this.urlActaView + "/" + id, { withCredentials : true });       
  }

  /**
   * CRUD con Actas
   */
  // Metodo para traer una lista de Actas
  public getActas(): Observable<Acta[]> {
    return this.http.get<Acta[]>(this.urlActa, { withCredentials : true });
  }
  
  public getActaDetalle(id: string): Observable<any> {
    return this.http.get<any>(this.urlActa + "/" + id, { withCredentials : true });
  }

  // Metodo para Insertar Nueva Acta
  public postActa(data: Acta): Observable<Acta>{
    return this.http.post<Acta>(this.urlActa, data, { withCredentials : true });
  }

  // Metodo para modificar garantia
  public putActa(data: Acta): Observable<Acta> {
    return this.http.put<Acta>(this.urlActa + '/' + data.ID, data, { withCredentials : true });
  }

  // Metodo para eliminar garantia
  public deleteActa(id: string): Observable<Acta>{
    return this.http.delete<Acta>(this.urlActa +"/" + id, { withCredentials : true });
  }
}