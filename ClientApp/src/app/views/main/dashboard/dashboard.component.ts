import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractListService } from '../contracts/contract-list/contract-list.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MainMenuService } from '../main-menu/main-menu.service';
import { XlsxExportService } from 'src/app/sharedService/xlsx-export/xlsx-export.service';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['codigo_del_Contrato', 'descripcion', 'nombre_del_Contratista', 'monto_Inicial', 'fecha_de_Inicio_del_Contrato', 'fecha_de_Finalizacion_del_Contrato', 'estado'];
  
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  dataSource: any;
  userAuth: any;

  constructor(
    private contratoService: ContractListService,
    private mainMenuService: MainMenuService,
    private xlsxExportService: XlsxExportService,
    private securityService: SecurityService
    ) {
  }

  ngOnInit() {
    this.mainMenuService.setIsDisabled(false);
    this.userAuth = this.securityService.GetAuthUser();
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
    
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
        this.dataSource.data = item;
        this.dataSource.paginator = this.paginator;
      }  
    });
    
  }

  exportAsXLSX(): void{
    this.xlsxExportService.exportToExcel(this.dataSource.data, 'reporte');
  }

}
