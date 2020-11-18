import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AuthUser } from 'src/app/model.component';
import { SecurityService } from 'src/app/services/security.service';


@Injectable({
  providedIn: 'root'
})
export class ExpirationdatesService {

  private hubConnection: signalR.HubConnection;
  userAuth: AuthUser;

  constructor(
    private toastr: ToastrService,
    private securityService: SecurityService
  ) { 
    this.userAuth = this.securityService.GetAuthUser();
  }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubURL +'notification')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('SendNotification', (message, userId) => {
      if(this.userAuth.id === userId){
        this.showSuccess(message);
      }      
    })
  }

  
  // Metodo para decirle al usuario que todo salio correcto
  showSuccess(mensaje: any) {
    this.toastr.info(mensaje, 'Aviso!', {closeButton: true, disableTimeOut: true});
  }

  showError() {
    this.toastr.error('A ocurrido un error en el servidor!', 'Error!', {closeButton: true, disableTimeOut: true});
  }
}

