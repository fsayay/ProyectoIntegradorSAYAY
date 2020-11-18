import { AbstractType, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { SecurityService } from 'src/app/services/security.service';
import { ContractListService } from 'src/app/views/main/contracts/contract-list/contract-list.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.css']
})
export class HistoricalComponent implements OnInit {

  userAuth: any;
  chart = [ ];

  // @ViewChild('myCanvas')
  // public canvas: ElementRef;
  // public context: CanvasRenderingContext2D;
  // public chartType: string = 'line';
  // public chartData: any[];
  // public chartLabels: any[];
  // public chartColors: any[];
  // public chartOptions: any; 

  public lineChartData: ChartDataSets[];
  
  public lineChartLabels: Label[];

  
  public lineChartColors: Color[] = [
    {
      borderColor: '#0F02AF',
      backgroundColor: '#65BEFF',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  

  constructor(
    private contratoService: ContractListService,
    private securityService: SecurityService
  ) { }

  ngOnInit() {
    this.lineChartData = [ { data: [], label: 'Presupuesto Anual' },];
    this.lineChartLabels = [];

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

          let total_y = [];
          años_x.forEach( x => {
            let total = 0;
            item.forEach( y => {
              if(y.año == x)
                total = total + y.total;                              
            });
            total_y.push(total);
          });        

          this.lineChartData = [ { data: total_y, label: 'Presupuesto Anual' },];
          this.lineChartLabels = años_x;


        }  
    });

  }

}
