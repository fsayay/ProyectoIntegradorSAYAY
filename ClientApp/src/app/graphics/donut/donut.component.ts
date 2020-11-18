import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { SecurityService } from 'src/app/services/security.service';
import { ContractListService } from 'src/app/views/main/contracts/contract-list/contract-list.service';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.css']
})
export class DonutComponent implements OnInit {

  userAuth: any;
  years: any;;
  contratos: any;
  montoReal = "";
  montoComplementario = "";
  montoTotal = "";
  disabled: boolean;

  constructor(
    private contratoService: ContractListService,
    private securityService: SecurityService
  ) { }

  // Doughnut
  public donutChartOptions: ChartOptions = {
        responsive: true,
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


  public doughnutChartLabels:string[] = ['Monto Real', 'Complementario'];
  public demodoughnutChartData:number[];
  public doughnutChartType:string = 'doughnut';
  public donutChartColors: Color[] = [
        { backgroundColor:[ '#65BEFF','#0F02AF'] }
      ];



 
  ngOnInit(){
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
    let real = 0;
    let complementario = 0;
    this.contratos.forEach( x => {
      if(x.año == data)
      {
        real = real + x.monto_Inicial;
        complementario = complementario + x.complementarios;
        
      } 
    });
    total_y.push(real);
    total_y.push(complementario);

    this.montoReal = real.toString();
    this.montoComplementario = complementario.toString();
    this.montoTotal = (real+complementario).toString();
              
    this.demodoughnutChartData  = total_y;
  }
}
