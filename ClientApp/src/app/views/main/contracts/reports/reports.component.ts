import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ReportsService } from './reports.service';
import { Router } from '@angular/router';
import { ReportsDialogComponent } from 'src/app/forms/reports-dialog/reports-dialog.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Informe } from 'src/app/model.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RecordService } from '../../record/record.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfLoaderComponent } from 'src/app/sharedService/pdf-loader/pdf-loader.component';
import { SecurityService } from 'src/app/services/security.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  displayedColumns: string[];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  dataSource: any;
  contratoActivo: any;
  formHistorial: FormGroup;
  userAuth: any;

  constructor(
    private informeService: ReportsService,
    private historialService: RecordService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private dialogForm: MatDialog,
    private securityService: SecurityService
    ) {

      this.userAuth = this.securityService.GetAuthUser();
      if(this.userAuth.rol==="Administrador-Contrato"){
        this.displayedColumns = ['txt_codigoInforme', 'tipoInforme', 'dt_fechaInforme', 'txt_archivoInforme', 'Modificar', 'Eliminar'];
      }else{
        this.displayedColumns = ['txt_codigoInforme', 'tipoInforme', 'dt_fechaInforme', 'txt_archivoInforme'];
      }
  }

  ngOnInit() {
    this.userAuth = this.securityService.GetAuthUser();
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
    this.cargarDatos();   
  }

  cargarDatos(){
    this.informeService.getInformesByContrato(this.contratoActivo.id).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, error => console.log("Error: " + error));
  }

  //Metodo para filtrar
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  //Metodo dialog form
  openFormDialog(data?: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    if(data){
      dialogConfig.data = data;
    }
    const dialogRef = this.dialogForm.open(ReportsDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.createForm(data)
        }        
      }
    );
  }

  createForm(data: any) {
    let informe: Informe;
    if(data.ID === 0){
      this.crearHistorial("Se ingreso un nuevo informe con código "+ data.txt_codigoInforme);
      this.informeService.postInforme(data).subscribe(informeDesdeWS => informe = informeDesdeWS, error => this.showError(), () => this.showSuccess("¡Ingreso de dato exitoso!!"));
    }else{
      this.informeService.putInforme(data).subscribe(garantiaDesdeWS => {
        this.crearHistorial("Se modifico el Informe con codigo " + data.txt_codigoInforme);
      }, error => this.showError(), () => this.showSuccess("¡Cambio de datos exitoso!!"));
    }    
  }

  //Instancia para el historial
  crearHistorial(mensaje: string) {
    this.historialForm(mensaje);
    let historial = this.formHistorial.value;
    this.historialService.postHistorial(historial).subscribe((data: any) => historial = data);
  }

  historialForm(mensaje: string){
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formHistorial = this.formBuilder.group({
      ID: 0,
      txt_seccionHistorial: "Informe",
      txt_accionHistorial: mensaje,
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id
    });
  }

  deleteConfirm(rowId: string){
    if (confirm("Seguro que desea eliminar este registro?")) {
      this.informeService.deleteInforme(rowId).subscribe(() => this.showSuccess('Elemento eliminado'));
    }
  }

  // Metodo para decirle al usuario que todo salio correcto
  showSuccess(mensaje: string) {
    this.toastr.success(mensaje, 'Success!');
    this.cargarDatos();
  }

  showError() {
    this.toastr.error('A ocurrido un error en el servidor!', 'Error!');
  }

  verPdf(url: any) {
    const modalRef = this.modalService.open(PdfLoaderComponent, { size: 'xl' });
    modalRef.componentInstance.filePath = url;
  }
}
