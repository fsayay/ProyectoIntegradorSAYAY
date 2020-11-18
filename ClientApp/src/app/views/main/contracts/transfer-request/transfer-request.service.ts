import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Solicitud } from 'src/app/model.component';

@Injectable({
  providedIn: 'root'
})
export class TransferRequestService {

  solicitudActual: any;

  urlSolicitud = environment.apiURL +'Solicitud';
  urlSolicitudView = environment.apiURL + 'SolicitudView';
  urlContratoView = environment.apiURL + 'ContratoView';

  constructor(private http: HttpClient) { }

  public setSolicitud(solicitud: any){
    this.solicitudActual = solicitud;
  }

  public getSolicitud(){
    return this.solicitudActual;
  }

  /**
   * VISTA
   * @param id DEL EMISOR O RECEPTOR
   */

  public getSolicitudesByAdmin(id: string): Observable<any> {
    return this.http.get<any>(this.urlSolicitudView + "/" + id, { withCredentials : true });       
  }

  public getSolicitudesByUASAdmin(id: string): Observable<any> {
    return this.http.post<any>(this.urlSolicitudView + "/getSolicitudByUAS/" + id, null, { withCredentials : true });       
  }

  public putContratos(data: any[]):Observable<any>{
    return this.http.put<any[]>(this.urlContratoView, data, { withCredentials: true });
  }


  /**
   * CRUD Solicitud de Transferencia
   * @param id del Usuario
   */
 
  // Metodo para Insertar Nueva Pago
  public postSolicitud(data: Solicitud): Observable<Solicitud>{
    return this.http.post<Solicitud>(this.urlSolicitud, data, { withCredentials : true });
  }


  public putSolicitud(data: any):Observable<any>{
    return this.http.put<any>(this.urlSolicitud +'/'+ data.id, data ,{withCredentials: true});
  }




  // Metodo para modificar garantia
  public putPago(data: Solicitud): Observable<Solicitud> {
    return this.http.put<Solicitud>(this.urlSolicitud + '/' + data.ID, data, { withCredentials : true });
  }
}
