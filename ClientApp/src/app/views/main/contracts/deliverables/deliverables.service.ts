import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entregable } from 'src/app/model.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliverablesService {

  urlEntregable = environment.apiURL + 'Entregable';
  urlEntregableView = environment.apiURL + 'EntregableView';

  constructor(private http: HttpClient) { }

  /**
   * Metodos con la Vista
   * @param id 
   */
  // Metodo para traer una lista de garantias por idContrato
  public getEntregablesByContrato(id: string): Observable<any> {
    return this.http.get<any>(this.urlEntregableView + "/" + id, { withCredentials : true });       
  }

  /**
   * Metodos con el controlador
   */
  // Metodo para traer una lista de entregables
  public getEntregables(): Observable<Entregable[]> {
    return this.http.get<Entregable[]>(this.urlEntregable, { withCredentials : true });
  }

  public getEntregableDetalle(id: string): Observable<any> {
    return this.http.get<any>(this.urlEntregable + "/" + id, { withCredentials : true });
  }

  // Metodo para Insertar Nueva Entregable
  public postEntregable(data: Entregable): Observable<Entregable>{
    return this.http.post<Entregable>(this.urlEntregable, data, { withCredentials : true });
  }

  // Metodo para modificar garantia
  public putEntregable(data: Entregable): Observable<Entregable> {
    return this.http.put<Entregable>(this.urlEntregable + '/' + data.ID, data, { withCredentials : true });
  }

  // Metodo para eliminar garantia
  public deleteEntregable(id: string): Observable<Entregable>{
    return this.http.delete<Entregable>(this.urlEntregable +"/" + id, { withCredentials : true });
  }
}