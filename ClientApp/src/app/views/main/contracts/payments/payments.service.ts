import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormaPago, Pago } from 'src/app/model.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) { }

  urlFormaPago = environment.apiURL +'FormaPago';
  urlFormaPagoView = environment.apiURL +'FormaPagoView';
  urlPago = environment.apiURL + 'Pago';

  /**
   * Metodos con la vista 
   * @param id del contrato
   */
  // Metodo para traer una lista de garantias por idContrato
  public getFormaPagoByContrato(id: string): Observable<any> {
    return this.http.get<any>(this.urlFormaPagoView + "/" + id, { withCredentials : true });       
  }


  /**
   * Metodos con el Controlador
   */
  // Metodo para traer una lista de Pagos
  public getPagos(): Observable<FormaPago[]> {
    return this.http.get<FormaPago[]>(this.urlFormaPago, { withCredentials : true });
  }

  public getPagoDetalle(id: string): Observable<any> {
    return this.http.get<any>(this.urlFormaPago + "/" + id, { withCredentials : true });
  }

  // Metodo para Insertar Nueva Pago
  public postFormaPago(data: FormaPago): Observable<FormaPago>{
    return this.http.post<FormaPago>(this.urlFormaPago, data, { withCredentials : true });
  }

  // Metodo para modificar garantia
  public putFormaPago(data: FormaPago): Observable<FormaPago> {
    return this.http.put<FormaPago>(this.urlFormaPago + '/' + data.ID, data, { withCredentials : true });
  }


  public postPago(data: Pago): Observable<Pago>{
    return this.http.post<Pago>(this.urlPago, data, { withCredentials : true });
  }

  // Metodo para modificar garantia
  public putPago(data: Pago): Observable<Pago> {
    return this.http.put<Pago>(this.urlPago + '/' + data.ID, data, { withCredentials : true });
  }

  // Metodo para eliminar garantia
  public deleteFormaPago(id: string): Observable<FormaPago>{
    return this.http.delete<FormaPago>(this.urlFormaPago +"/" + id, { withCredentials : true });
  }

  // Metodo para registrar el CUR de un pago
  public putCurPago(data: any): Observable<any>{
    return this.http.put<Pago>(this.urlPago +'/'+data.ID, data, {withCredentials : true });
  }

  // Metodo para eliminar garantia
  public deletePago(id: string): Observable<Pago>{
    return this.http.delete<Pago>(this.urlPago +"/" + id, { withCredentials : true });
  }
  
}