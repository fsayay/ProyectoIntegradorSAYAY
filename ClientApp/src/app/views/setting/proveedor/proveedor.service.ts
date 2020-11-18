import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  urlProveedor = environment.apiURL + 'Proveedor';

  constructor(
    private http: HttpClient
  ) { }

  public getProveedor(): Observable<any> {
    return this.http.get<any>(this.urlProveedor, { withCredentials : true });
  }

  public postProveedor(proveedor: any): Observable<any> {
    return this.http.post<any>(this.urlProveedor, proveedor, {withCredentials : true });
  }

  public putProveedor(proveedor: any): Observable<any> {
    return this.http.put<any>(this.urlProveedor + "/" + proveedor.ID, proveedor, { withCredentials : true });
  }

  public deleteProveedor(id: any): Observable<any> {
    return this.http.delete<any>(this.urlProveedor + "/" + id, {withCredentials : true });
  }

}
