import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { SecurityService } from 'src/app/services/security.service';
import { ContractListService } from 'src/app/views/main/contracts/contract-list/contract-list.service';
import { Color } from 'ng2-charts';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.css']
})
export class GlobalComponent implements OnInit {

  userAuth: any;
  years: any;;
  contratos: any;
  montoReal = "";
  montoComplementario = "";
  montoTotal = "";

  dataSource: any;
  displayedColumns: string[] = ['administrador', 'totalContratos', 'complementarios', 'montoTotal'];

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

    public mbarChartLabels:string[];
    public barChartType:string = 'bar';
    public barChartLegend:boolean = true;

    public barChartColors:Array<any> = [
      {
        backgroundColor: '#65BEFF',
        borderColor: 'rgba(105,159,177,1)',
        pointBackgroundColor: 'rgba(105,159,177,1)',
        pointBorderColor: '#fafafa',
        pointHoverBackgroundColor: '#fafafa',
        pointHoverBorderColor: 'rgba(105,159,177)'
      }
    ];
    public barChartData:any[];

    

  constructor(
    private contratoService: ContractListService,
    private securityService: SecurityService
  ) { }

  ngOnInit() {
    this.userAuth = this.securityService.GetAuthUser(); 
    this.contratoService.getReportsView().subscribe( item => {
      console.log(item);
      if(item != '')
        {
          let años_x = [];
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

    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];

    let admins_x = [];
    let total_y = [];
    let montoTotal = 0;
    let numContratos = 0;
    let complementarios = 0;
    this.contratos.forEach( x => 
    {
      if(x.año == data)
      {
        if (admins_x.indexOf(x.nombre_del_Administrador) == -1)
          admins_x.push(x.nombre_del_Administrador);
      } 
    });

    this.mbarChartLabels = ['MIGUEL EGBERTO FUENTES PEÑAHERRERA', '2013', '2014', '2015', '2016', '2017', '2018'];
    this.barChartData = [
      {data: [55, 60, 75, 82, 56, 62, 80], label: 'Monto Anual'}
    ];
       
  }
}

export interface tabla{
  administrador: string;
  numContratos: number;
  numComplementarios: number;
  montoTotal: number;
}


