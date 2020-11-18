import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vencimiento } from 'src/app/model.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpiratiosService {

  urlVencimiento = environment.apiURL +'Vencimiento';
  urlVencimientoView = environment.apiURL + 'VencimientoView';

  constructor(private http: HttpClient) { }

  
  /**
   * VISTA
   * @param id Contrato
   */
  public getVencimientoViewByContrato(id: string): Observable<any> {
    return this.http.get<any>(this.urlVencimientoView + "/" + id, { withCredentials : true });       
  }

  // Metodo para Insertar Nueva Vencimiento
  public postVencimientoView(data: Vencimiento[]): Observable<Vencimiento[]>{
    return this.http.post<Vencimiento[]>(this.urlVencimientoView, data, { withCredentials : true });
  }
  
  /**
   * Metodos con el controlador
   * @param id 
   */
  // Metodo para traer una lista de garantias por idContrato 
  public getVencimientosByContrato(id: string): Observable<any> {
    return this.http.get<any>(this.urlVencimiento + "/" + id, { withCredentials : true });       
  }

  // Metodo para Insertar Nueva Vencimiento
  public postVencimiento(data: Vencimiento[]): Observable<Vencimiento[]>{
    return this.http.post<Vencimiento[]>(this.urlVencimiento, data, { withCredentials : true });
  }

  // Metodo para modificar garantia
  public putVencimiento(data: Vencimiento): Observable<Vencimiento> {
    return this.http.put<Vencimiento>(this.urlVencimiento + '/' + data.ID, data);
  }
}