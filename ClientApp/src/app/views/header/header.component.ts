import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AuthUser } from 'src/app/model.component';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  isAuthenticated: boolean;
  _authUser: AuthUser;
  urlReturn: any;
  urlLogOut: any;
  
  constructor(
    private securityService: SecurityService,
    private authService: AuthService) {
      this.isAuthenticated = false;
     }

  ngOnInit() {
    this.urlReturn = environment.apiURL + 'Login/login?returnUrl=http://localhost:4200/home/';
    this.urlLogOut = environment.apiURL + 'login/logout';
    if(this.securityService.IsAuthorized){
      this._authUser = this.securityService.GetAuthUser();
      this.isAuthenticated = true;    
    }else{
      this.authService.userAuth$.subscribe( userAuth => {
        this._authUser = userAuth;
        this.isAuthenticated = true;      
      });
    }
  }

  logout() {
    this.securityService.LogOff();
  }  
}
