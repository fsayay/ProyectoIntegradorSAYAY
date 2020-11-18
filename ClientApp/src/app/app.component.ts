import { Component, OnInit } from '@angular/core';
import * as signalR from '@aspnet/signalr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
  ){}

  ngOnInit(){
    var connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:50000/changeDB')
      .build();

    connection.start()
      .then(function () {
        console.log('connection started');
      })
      .catch(error => {
          console.error(error.message);
      });  

    connection.on('newRegister', function (message) {
      console.log(message);
    });
    

  }

  
  
}

