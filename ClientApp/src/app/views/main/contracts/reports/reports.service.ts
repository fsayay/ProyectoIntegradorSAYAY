import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Informe } from 'src/app/model.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  urlInforme = environment.apiURL +'Informe';
  urlInformeView = environment.apiURL +'InformeView';

  constructor(private http: HttpClient) { }

  /**
   * Vista
   * @param id del contrato
   */
  // Metodo para traer una lista de garantias por idContrato
  public getInformesByContrato(id: string): Observable<any> {
    return this.http.get<any>(this.urlInformeView + "/" + id, { withCredentials : true });       
  }

  /**
   * CRUD Informes
   */
  // Metodo para traer una lista de Informes
  public getInformes(): Observable<Informe[]> {
    return this.http.get<Informe[]>(this.urlInforme, { withCredentials : true });
  }   

  public getInformeDetalle(id: string): Observable<any> {
    return this.http.get<any>(this.urlInforme + "/" + id, { withCredentials : true });
  }

  // Metodo para Insertar Nueva Informe
  public postInforme(data: Informe): Observable<Informe>{
    return this.http.post<Informe>(this.urlInforme, data, { withCredentials : true });
  }

  // Metodo para modificar garantia
  public putInforme(data: Informe): Observable<Informe> {
    return this.http.put<Informe>(this.urlInforme + '/' + data.ID, data, { withCredentials : true });
  }

  // Metodo para eliminar garantia
  public deleteInforme(id: string): Observable<Informe>{
    return this.http.delete<Informe>(this.urlInforme +"/" + id, { withCredentials : true });
  }

}