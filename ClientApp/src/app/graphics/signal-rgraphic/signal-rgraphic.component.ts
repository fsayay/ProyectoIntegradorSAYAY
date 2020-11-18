import { Component, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/sharedService/Notification/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-signal-rgraphic',
  templateUrl: './signal-rgraphic.component.html',
  styleUrls: ['./signal-rgraphic.component.css']
})
export class SignalRGraphicComponent implements OnInit {

  title = 'RealTimeCharts-Client';
  userAuth: any;

  public chartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  public chartLabels: string[] = ['# de contratos por Tipo'];
  public chartType: string = 'bar';
  public chartLegend: boolean = true;
  public colors: any[] = [
    { backgroundColor: '#5491DA' },
    { backgroundColor: '#E74C3C' }, 
    { backgroundColor: '#82E0AA' }, 
    { backgroundColor: '#E5E7E9' }
  ]
 
  constructor(
    public signalRService: SignalRService,
    private http: HttpClient,
    private toastr: ToastrService,
    private securityService: SecurityService
  ) {
   }

  ngOnInit(): void {
    this.userAuth = this.securityService.GetAuthUser();
    console.log(this.userAuth);
    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener();

    this.startHttpRequest();
  }

  private startHttpRequest = () => {
    this.http.get(environment.apiURL + 'chart')
      .subscribe(res => {
        console.log(res);        
      });
       
  }  
}


