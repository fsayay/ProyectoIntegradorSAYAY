import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {

  urlUnidad = environment.apiURL + 'UnidadConsolidadora';

  constructor(
    private http: HttpClient
  ) { }

  public getUnidad(): Observable<any> {
    return this.http.get<any>(this.urlUnidad, { withCredentials : true });
  }

  public postUnidad(unidad: any): Observable<any> {
    return this.http.post<any>(this.urlUnidad, unidad, {withCredentials : true });
  }

  public putUnidad(unidad: any): Observable<any> {
    return this.http.put<any>(this.urlUnidad + "/" + unidad.ID, unidad, { withCredentials : true });
  }

  public deleteUnidad(id: any): Observable<any> {
    return this.http.delete<any>(this.urlUnidad + "/" + id, {withCredentials : true });
  }

}
