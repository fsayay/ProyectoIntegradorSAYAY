import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { SecurityService } from 'src/app/services/security.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ExpirationdatesService } from 'src/app/sharedService/Notification/expirationdates.service';
import { MatSort } from '@angular/material/sort';
import { MainMenuService } from '../../main-menu/main-menu.service';
import { ContractListService } from './contract-list.service';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
})
export class ContractListComponent implements AfterViewInit {

  displayedColumns: string[] = ['txt_codigoContrato', 'txt_objetoContratacion', 'tipoContrato', 'txt_nombreProveedor', 'montoActual', 'dt_fechaInicio', 'fechaFinReal', 'estadoContrato'];
  dataSource: any;
  userAuth: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private contratoService: ContractListService,
    private securityService: SecurityService,
    private mainMenuService: MainMenuService,
    private notifyExpiration: ExpirationdatesService,
    private router: Router,
    private http: HttpClient
  ){
    
  }

  ngOnInit(){
    this.userAuth = this.securityService.GetAuthUser();
    
    this.mainMenuService.setIsDisabled(false);
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
    if(this.userAuth.rol =='Administrador-Contrato'){
      this.contratoService.getContratosByAdmin(this.userAuth.id).subscribe(data => {
        console.log(data);
         this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;        
      }, error => console.log("Error: " + error));
    }else {
      this.contratoService.getContratosView().subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;      
      }, error => console.log("Error: " + error));
    }

    this.notifyExpiration.startConnection();
    this.notifyExpiration.addTransferChartDataListener();
    this.startHttpRequest();
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  startHttpRequest = () => {
    this.http.get(environment.apiURL + 'notification/' + this.userAuth.id)
      .subscribe(res => {
        console.log(res);        
      });
       
  }

  nuevo(){
    localStorage.setItem('contratoActivo', null);
    this.router.navigate(["/Nuevo Contrato"]);
  }
  //Metodo para filtrar
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  viewDetail(row: any){
    this.mainMenuService.setIsDisabled(true);
    localStorage.setItem('contratoActivo', JSON.stringify(row));
    localStorage.setItem('idContratoActivo', JSON.stringify(row.id));
    if((row.qn_tipoContrato === 0 || row.qn_tipoContrato === null)&&this.userAuth.rol === 'Administrador-Contrato'){
      this.router.navigate(["/Contrato/Registro"]);
    }else{
      this.router.navigate(["/Contrato/" + row.id]);
    }
  }
}


