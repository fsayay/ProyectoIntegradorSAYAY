import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: any;
  private userStorage: any;

  constructor() {
    this.storage = sessionStorage;
    this.userStorage = localStorage;
   }

   public retrieve(key:string): any{
     const item = this.storage.getItem(key);

     if(item && item !== 'undefine'){
       return JSON.parse(item);
     }

     return;
   }

   public store(key: string, value: any){
     this.storage.setItem(key, JSON.stringify(value));
   }

   public userRetrieve(key:string): any{
    const item = this.userStorage.getItem(key);

    if(item && item !== 'undefine'){
      return JSON.parse(item);
    }

    return;
  }

  public userStore(key: string, value: any){
    this.userStorage.setItem(key, JSON.stringify(value));
  }
}
