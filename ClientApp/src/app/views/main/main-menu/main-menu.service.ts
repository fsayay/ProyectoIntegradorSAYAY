import { Observable } from 'rxjs';
import { Injectable, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainMenuService {

  public isDisabled: boolean;
  
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {

  }

  public setIsDisabled(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  public getIsDisabled() {
    return this.isDisabled;
  }  
  
}
