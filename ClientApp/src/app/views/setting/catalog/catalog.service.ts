import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seccion, Tipo } from 'src/app/model.component';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  public categoriaActual: Seccion;

  urlItem = environment.apiURL +'Seccion';
  urlUsuario = environment.apiURL +'UserRol';
  urlRol = environment.apiURL +'Rol';
  urlTipo = environment.apiURL + 'Tipo';
  urlAdmin = environment.apiURL + 'AdminView';

  constructor(
    private http: HttpClient
  ) { }

  setCategoria(categoria: Seccion) {
    this.categoriaActual = categoria;
  }

  getCategoriaActual() {
    return this.categoriaActual;
  }

  public getItems(): Observable<Seccion[]> {
    return this.http.get<Seccion[]>(this.urlItem, { withCredentials : true });      
  }

  public getItem(id: number):Observable<Seccion>{
    const url = this.urlItem + "/" +id;
    return this.http.get<Seccion>(url, { withCredentials : true });
  }

  // Metodo para Insertar Nueva Entregable
  public postSeccion(data: Seccion): Observable<Seccion>{
    return this.http.post<Seccion>(this.urlItem, data, { withCredentials : true });
  }

  // Metodo para modificar garantia
  public putSeccion(data: Seccion): Observable<Seccion> {
    return this.http.put<Seccion>(this.urlItem + '/' + data.seccionID, data, { withCredentials : true });
  }

  //////////////           TIPOS                /////////////////////////
  public postTipo(data: Tipo):Observable<Tipo>{
    return this.http.post<Tipo>(this.urlTipo, data, { withCredentials: true});    
  }

  public putTipo(data: Tipo): Observable<Tipo> {
    return this.http.put<Tipo>(this.urlTipo + '/' + data.tipoID, data, { withCredentials : true });
  }

  //////////////          USUARIOS              /////////////////////////
  public getUsersRol(): Observable<any[]> {
    return this.http.get<any[]>(this.urlUsuario, { withCredentials : true });      
  }

  public getAllUsers():Observable<any>{
    const url = this.urlUsuario + "/getAllUsers" ;
    return this.http.post<any>(url, null, { withCredentials : true });
  }

  public postUserRol(data: any): Observable<any>{
    return this.http.post<any>(this.urlUsuario, data, { withCredentials : true });
  }

  public putUserRol(data: any): Observable<any> {
    return this.http.put<any>(this.urlItem + '/' + data.userID, data, { withCredentials : true });
  }

  /**
   * Vista ROL
   */
  
  public getRol(): Observable<any> {    
    return this.http.get<any>(this.urlRol, { withCredentials : true });      
  }

  // Metodo para Insertar Nueva Entregable
  public postRol(data: any): Observable<any>{
    return this.http.post<any>(this.urlRol, data, { withCredentials : true });
  }

  // Metodo para modificar garantia
  public putRol(data: any): Observable<any> {
    return this.http.put<any>(this.urlRol + '/' + data.ID, data, { withCredentials : true });
  }

  /**
   * Vista Admin
   */

   public getAdmins(): Observable<any[]>{
     return this.http.get<any[]>(this.urlAdmin, { withCredentials: true });
   }

   /**  
    *  Unidad Consolidadora
    */
   public getUnidades():Observable<any[]>{
     var url = './assets/unidades.json';
     return this.http.get<any[]>(url);
   }


   /**
    * TEST
    */

   public fetchStates() : Observable<HttpEvent<any>> {
    const endpoint = 'https://india.getsandbox.com/states';
    const req = new HttpRequest('GET', endpoint);
    return this.http.request(req);
  }

}
