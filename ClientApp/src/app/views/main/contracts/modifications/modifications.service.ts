import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modificacion } from 'src/app/model.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModificationsService {

  urlModificacion = environment.apiURL + 'Modificacion';
  urlModificacionView = environment.apiURL + 'ModificacionView';

  constructor(private http: HttpClient) { }

  /**
   * Metodos con la vista
   * @param id del Contrato
   */
  // Metodo para traer una lista de garantias por idContrato
  public getModificacionesByContrato(id: string): Observable<any> {
    return this.http.get<any>(this.urlModificacionView + "/" + id, { withCredentials : true });       
  }

  /**
   * Metodos con el controlador
   */

  // Metodo para traer una lista de Modificacions
  public getModificaciones(): Observable<Modificacion[]> {
    return this.http.get<Modificacion[]>(this.urlModificacion, { withCredentials : true });
  }

  public getModificacionDetalle(id: string): Observable<any> {
    return this.http.get<any>(this.urlModificacion + "/" + id, { withCredentials : true });
  }

  // Metodo para Insertar Nueva Modificacion
  public postModificacion(data: Modificacion): Observable<Modificacion>{
    return this.http.post<Modificacion>(this.urlModificacion, data, { withCredentials : true });
  }

  // Metodo para modificar una modificacion
  public putModificacion(data: Modificacion): Observable<Modificacion> {
    return this.http.put<Modificacion>(this.urlModificacion + '/' + data.ID, data);
  }
}