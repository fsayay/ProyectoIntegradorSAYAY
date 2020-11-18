import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ChangeDBService {
  private hubConnection: signalR.HubConnection;
  public data: any;

  constructor(
    private toastr: ToastrService
  ) { }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubURL +'notify')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addChangeBDListener = () => {
    this.hubConnection.on('changeDB', (data) => {
      this.data = data;
      this.showSuccess(data);
    })
  }

  // Metodo para decirle al usuario que todo salio correcto
  showSuccess(mensaje: any) {
    this.toastr.warning(mensaje, 'Success!');
  }

  showError() {
    this.toastr.error('A ocurrido un error en el servidor!', 'Error!');
  }
}

