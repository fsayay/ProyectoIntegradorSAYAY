import {Component, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { ContractListService } from '../contracts/contract-list/contract-list.service';
import { RecordService } from './record.service';
import { MainMenuService } from '../main-menu/main-menu.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SecurityService } from 'src/app/services/security.service';

/**
 * @title Table with expandable rows
 */
@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RecordComponent {
  columnsToDisplay = ['txt_codigoContrato', 'txt_objetoContratacion', 'txt_nombreProveedor', 'vm_montoAdjudicado', 'txt_nombre']; 

  userAuth: any;
  contratos: any;
  historial: any;
  dataSource: any;
  tempHistorial: any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private contratoService: ContractListService,
    private historialService: RecordService,
    private mainMenuService: MainMenuService,
    private securityService: SecurityService
  ){
    this.historialService.getHistorial().subscribe(item => {
      this.historial = item;
    })
  }
  ngOnInit(){
    this.mainMenuService.setIsDisabled(false);
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];      
    
    this.userAuth = this.securityService.GetAuthUser();
    if(this.userAuth.rol == 'Administrador-Contrato'){
      this.contratoService.getContratosByAdmin(this.userAuth.id).subscribe(item => {
        this.dataSource.data = item;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;      
      }, error => console.error(error));
    }else{
      this.contratoService.getContratosView().subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;      
      }, error => console.log("Error: " + error));
    }
    
  }

  //Metodo para filtrar
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  cambiar(elemento: any){
   this.tempHistorial = this.historial.filter((item)=> item.contratoID === elemento.id);
  }
}
