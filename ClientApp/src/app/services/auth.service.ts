import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { AuthUser} from '../model.component';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  urlLogin = environment + 'Login';

  _user: AuthUser;
  _isLoggedIn: boolean;

  userAuth$ = new EventEmitter<AuthUser>();
  
  constructor(
    private _cookieService: CookieService, 
    private _http: HttpClient) {
    this._isLoggedIn = false;
   }

  isLoggedIn(): boolean {
    if (this._cookieService.check(environment.AppCookieName)) {
      let str:string = this._cookieService.get(environment.AppCookieName);
      this._isLoggedIn = true;
    }
    return this._isLoggedIn;
  }

  logout(): void{
    this._isLoggedIn = false;
    this._user = null;
  }

  getUser(): Observable<any> {
    if(this.isLoggedIn()){
      if (this._isLoggedIn && this._user) 
        { 
          return of(this._user); 
        }     
        //return this._http.get<any>('http://192.168.6.144:50000/api/Login/getUser', { withCredentials : true, headers: new HttpHeaders({ 'Content-Type' : 'application/json' }) });
        return this._http.get<any>('http://localhost:50000/api/Login/getUser', { withCredentials : true, headers: new HttpHeaders({ 'Content-Type' : 'application/json' }) });
    }
    else{
      console.log("No Exist");
    }
    
  }
}
