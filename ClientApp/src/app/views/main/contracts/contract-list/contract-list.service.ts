import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contrato } from 'src/app/model.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContractListService {

  urlContrato = environment.apiURL + 'Contrato';
  urlContratoView = environment.apiURL + 'ContratoView';
  urlReportView = environment.apiURL + 'ReportView';

  constructor(private http: HttpClient) {
   }




  /**
   * Vista
   */
  
  // Todos los contratos en vistas
  public getContratosView(): Observable<any>{
    return this.http.get(this.urlContratoView, { withCredentials: true});
  }

  public getReportsView(): Observable<any>{
    return this.http.get(this.urlReportView, { withCredentials: true});
  }

  public getContratoDetalle(id: string): Observable<any> {
    return this.http.get<any>(this.urlContratoView + '/' + id, { withCredentials : true });
  }

  public getContratosByAdmin(id: string): Observable<any> {
    return this.http.post<any>(this.urlContratoView + '/getContratosByAdmin/' + id, null, { withCredentials : true });       
  }

  /**
   * CRUD Contratos
   */
  // Metodo para traer una lista de contratos
  public getContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(this.urlContrato, { withCredentials : true });       
  }

  // Metodo para obtener un Contrato
  public getContrato(id: string): Observable<any>{
    const url = this.urlContrato + "/" +id;
    return this.http.get<any>(url, { withCredentials : true });
  }

  // Metodo para ingresar nuevo Contrato
  public postContrato(contrato: Contrato): Observable<Contrato> {
    return this.http.post<Contrato>(this.urlContrato, contrato, { withCredentials : true });
  }

  public putContrato(contrato: any): Observable<any> {
    return this.http.put<any>(this.urlContrato + "/" +contrato.id, contrato, { withCredentials : true });
  }
}


