import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RecordService } from '../../record/record.service';
import { TransferRequestService } from './transfer-request.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TransferResponseDialogComponent } from 'src/app/forms/transfer-response-dialog/transfer-response-dialog.component';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-transfer-request',
  templateUrl: './transfer-request.component.html',
  styleUrls: ['./transfer-request.component.css']
})

export class TransferRequestComponent {

  displayedColumns: string[] = ['txt_codigoSolicitud', 'qn_cantContratos', 'txt_motivoSolicitud', 'txt_admRecomendado', 'dt_fechaUltimoCambio', 'receptor', 'estadoSolicitud'];
  displayedColumns1: string[] = ['txt_codigoSolicitud', 'qn_cantContratos', 'txt_motivoSolicitud', 'txt_admRecomendado', 'dt_fechaUltimoCambio', 'emisor', 'estadoSolicitud'];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  dataSource: any;
  userAuth: any;
  formHistorial: FormGroup;

  constructor(
    private transferService: TransferRequestService,
    private toastr: ToastrService,
    private router: Router,
    private solicitudService: TransferRequestService,
    private securityService: SecurityService
    ) {
  }

  ngOnInit() {
    this.userAuth = this.securityService.GetAuthUser();
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
    this.cargarDatos();
  }

  cargarDatos(){
    if(this.userAuth.rol === 'Administrador-Contrato'){
      this.transferService.getSolicitudesByAdmin(this.userAuth.id).subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }, error => console.log("Error: " + error));
    }else if(this.userAuth.rol === 'Usuario-UAS'){
      this.transferService.getSolicitudesByUASAdmin(this.userAuth.id).subscribe(data => {
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

  transferResponse(solicitud: any){
    this.solicitudService.setSolicitud(solicitud);
    this.router.navigate(["/Solicitudes/Tranferir-Contratos"]);
  }

  // Metodo para decirle al usuario que todo salio correcto
  showSuccess(mensaje: string) {
    this.toastr.success(mensaje, 'Success!');
    this.cargarDatos();
  }

  showError() {
    this.toastr.error('A ocurrido un error en el servidor!', 'Error!');
  }
}

