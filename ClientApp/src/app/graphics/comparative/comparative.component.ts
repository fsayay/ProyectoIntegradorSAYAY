import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { SecurityService } from 'src/app/services/security.service';
import { ContractListService } from 'src/app/views/main/contracts/contract-list/contract-list.service';

@Component({
  selector: 'app-comparative',
  templateUrl: './comparative.component.html',
  styleUrls: ['./comparative.component.css']
})
export class ComparativeComponent implements OnInit {


  userAuth: any;

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
    },
    { 
      backgroundColor: '#0F02AF',
      borderColor: 'rgba(77,20,96,1)',
      pointBackgroundColor: 'rgba(77,20,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,20,96,1)'
    },
    { 
      backgroundColor: '#38E2F3',
      borderColor: 'rgba(77,20,96,1)',
      pointBackgroundColor: 'rgba(77,20,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,20,96,1)'
    }
  ];
    public barChartData:any[];
  
  constructor(
    private securityService: SecurityService,
    private contratoService: ContractListService
  ) { }

  ngOnInit() {

    this.mbarChartLabels  = ['2012', '2013','2014'];
    this.barChartData  = [
      {data: [55, 60], label: 'Obras'},
      {data: [58, 55], label: 'Servicios'},
      {data: [50, 76], label: 'Bienes'}
    ];

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

          let total_obras = [];
          let total_servicios = [];
          let total_bienes = [];
          años_x.forEach( x => {
            let totalObras = 0;
            let totalServicios = 0;
            let totalBienes = 0;
            item.forEach( y => {
              if(y.año == x)
              {
                if(y.tipo_de_Contrato == "Servicios")
                  totalServicios = totalServicios + 1;
                if(y.tipo_de_Contrato == "Obras")
                  totalObras = totalObras + 1;
                if(y.tipo_de_Contrato == "Bienes")
                  totalBienes = totalBienes + 1;
              }
                                              
            });
            total_obras.push(totalObras);
            total_servicios.push(totalServicios);
            total_bienes.push(totalBienes);            
          });          

         
          this.mbarChartLabels  = años_x;
          this.barChartData  = [
            {data: total_obras, label: 'Obras'},
            {data: total_servicios, label: 'Servicios'},
            {data: total_bienes, label: 'Bienes'}
          ];


        }
    });
  }

}
