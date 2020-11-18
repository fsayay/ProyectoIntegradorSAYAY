import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Garantia } from 'src/app/model.component';
import { environment } from 'src/environments/environment';
import { env } from 'process';

@Injectable({
  providedIn: 'root'
})
export class GuaranteesService {

  urlGarantia = environment.apiURL + 'Garantia';
  urlGarantiaView = environment.apiURL + 'GarantiaView';
  
  constructor(
    private http: HttpClient) { }

  /**
   * Metodos con la vista
   */  
  // Metodo para traer una lista de garantias por idContrato
   public getGarantiasByContrato(id: string): Observable<any> {
    return this.http.get<any>(this.urlGarantiaView + "/" + id, { withCredentials : true });       
  }

  /**
   * Metodos con el controlador
   */
  // Metodo para traer una lista de entregables
  public getGarantias(): Observable<Garantia[]> {
    return this.http.get<Garantia[]>(this.urlGarantia, { withCredentials : true });
  }

  public getGarantiaDetalle(id: string): Observable<any> {
    return this.http.get<any>(this.urlGarantia + "/" + id, { withCredentials : true });
  }

  // Metodo para Insertar Nueva Garantia
  public postGarantia(data: Garantia): Observable<Garantia>{
    return this.http.post<Garantia>(this.urlGarantia, data, { withCredentials : true });
  }

  // Metodo para modificar garantia
  public putGarantia(data: Garantia): Observable<Garantia> {
    return this.http.put<Garantia>(this.urlGarantia + '/' + data.ID, data, { withCredentials : true });
  }

  // Metodo para eliminar garantia
  public deleteGarantia(id: string): Observable<Garantia>{
    return this.http.delete<Garantia>(this.urlGarantia +"/" + id, { withCredentials : true });
  }


}