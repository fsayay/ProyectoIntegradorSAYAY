import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { SecurityService } from 'src/app/services/security.service';
import { ContractListService } from 'src/app/views/main/contracts/contract-list/contract-list.service';

@Component({
  selector: 'app-semidonut',
  templateUrl: './semidonut.component.html',
  styleUrls: ['./semidonut.component.css']
})
export class SemidonutComponent implements OnInit {


  userAuth: any;
  years: any;;
  contratos: any;

  // Doughnut

  public donutChartOptions: ChartOptions = {
      responsive: true,
      circumference: Math.PI,
      rotation : Math.PI,
      cutoutPercentage : 75, // precent,
      legend: {
        position: 'left',
        display: true,
        labels: {
          fontSize: 11
        }
      },
      tooltips:{
        enabled:true
      }
    };
  public doughnutChartLabels:string[] = ['Finalizado', 'Por Finalizar'];
  public demodoughnutChartData:number[];
  public doughnutChartType:string = 'doughnut';
  public donutChartColors: Color[] = [
      { backgroundColor:[ '#65BEFF','#0F02AF'] }
    ];

  constructor(
    private contratoService: ContractListService,
    private securityService: SecurityService
  ){}

  ngOnInit() {

    this.demodoughnutChartData  = [0, 0];

    this.userAuth = this.securityService.GetAuthUser(); 
    this.contratoService.getReportsView().subscribe( item => {
      if (this.userAuth.rol == 'Administrador-Contrato') {
        let nombre = this.userAuth.nombres + ' '+ this.userAuth.apellidos;
        // Filtrar por usuario administrador
        item.forEach(x => {
          if (x.nombre_del_Administrador.toLocaleLowerCase() != nombre.toLocaleLowerCase()) {
            var i = item.indexOf(x);
            i !== -1 && item.splice(i, 1);
          }
        });
      }
      if(item != '')
      {
        let años_x = [ ];
        item.forEach( x => {
          if (años_x.indexOf(x.año) == -1)
            años_x.push(x.año);
        })
        //Ordenamineto por año
        años_x.sort(function(a, b) {
          return a - b;
        });
        this.years = años_x;
        this.contratos = item;
      }
    });

  }

  selectYear(data){
    let total_y = [];
    let pendiente = 0;
    let finalizado = 0;

    this.contratos.forEach( y => {
      if(y.estado == "Finalizado" && y.año == data)
        finalizado = finalizado + 1;
      if(y.estado == "Pendiente" && y.año == data)
        pendiente = pendiente +1;                              
    });
    total_y.push(finalizado);
    total_y.push(pendiente);

    this.demodoughnutChartData  = total_y;
  }  
}