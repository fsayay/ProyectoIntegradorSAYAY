import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  IsAuthorized: any;

  private authSource = new Subject<boolean>();
  authChallenge$ = this.authSource.asObservable();

  constructor(private storeService: StorageService) {
    if(this.storeService.retrieve('IsAuthorized') !== ''){
      this.IsAuthorized = this.storeService.retrieve('IsAuthorized');
      this.authSource.next(true);
    }
   }

   public GetToken(): any {
    return this.storeService.retrieve('authData');
   }

   public GetAuthUser(): any {
     return this.storeService.userRetrieve('authUser');
   }

   public ResetAuthData(){
     this.storeService.store('authData', '');
     this.IsAuthorized = false;
     this.storeService.store('IsAuthorized', false);
     this.storeService.userStore('authUser','');
   }

   public SetAuthData(token: any, authUser: any){
     this.storeService.store('authData',token);
     this.IsAuthorized = true;
     this.storeService.store('IsAuthorized', true);
     this.storeService.userStore('authUser', authUser )
     this.authSource.next(true);
   }

   public LogOff(){
     this.ResetAuthData();
     this.authSource.next(true);
   }
}
