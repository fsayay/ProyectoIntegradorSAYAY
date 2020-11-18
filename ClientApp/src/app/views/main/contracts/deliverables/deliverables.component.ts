import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeliverablesService } from './deliverables.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DeliverablesDialogComponent } from 'src/app/forms/deliverables-dialog/deliverables-dialog.component';
import { Entregable } from 'src/app/model.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RecordService } from '../../record/record.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfLoaderComponent } from 'src/app/sharedService/pdf-loader/pdf-loader.component';
import { DeliverableFileDialogComponent } from 'src/app/forms/deliverable-file-dialog/deliverable-file-dialog.component';
import { SecurityService } from 'src/app/services/security.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-deliverables',
  templateUrl: './deliverables.component.html'
})
export class DeliverablesComponent implements OnInit {

  displayedColumns: string[];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  dataSource: any;
  contrato: any;
  formHistorial: FormGroup;
  contratoActivo:any;
  userAuth: any;

  constructor(
    private entregableService: DeliverablesService,
    private dialogForm: MatDialog,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private historialService: RecordService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private securityService: SecurityService
    ) {
      this.userAuth = this.securityService.GetAuthUser();
      if(this.userAuth.rol==="Administrador-Contrato"){
        this.displayedColumns = ['qn_cantidadEntregable', 'tipoEntregable', 'txt_descripcionEntregable', 'dt_fechaEntregable', 'dt_fechaRealEntregable', 'txt_archivoEntregable', 'Modificar', 'Eliminar'];
      }else{
        this.displayedColumns = ['qn_cantidadEntregable', 'tipoEntregable', 'txt_descripcionEntregable', 'dt_fechaEntregable', 'dt_fechaRealEntregable', 'txt_archivoEntregable'];
      }
  }

  ngOnInit() {
    this.userAuth = this.securityService.GetAuthUser();
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
    this.contrato = JSON.parse(localStorage.getItem('contratoActivo'));  
    this.cargarDatos();
  }

  cargarDatos(){
    this.entregableService.getEntregablesByContrato(this.contrato.id).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, error => console.log("Error: " + error));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); 
    filterValue = filterValue.toLowerCase(); 
    this.dataSource.filter = filterValue;
  }

  crearHistorial(mensaje: string) {
    this.historialForm(mensaje);
    let historial = this.formHistorial.value;
    this.historialService.postHistorial(historial).subscribe((data: any) => historial = data);
  }

  historialForm(mensaje: string){
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formHistorial = this.formBuilder.group({
      ID: 0,
      txt_seccionHistorial: "Entregable",
      txt_accionHistorial: mensaje,
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id
    });
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
    const dialogRef = this.dialogForm.open(DeliverablesDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.createForm(data)
        }        
      }
    );
  }

  createForm(data: any) {
    let entregable: Entregable;    
    if(data.ID === 0){      
      this.entregableService.postEntregable(data).subscribe(entregable => {
        this.crearHistorial("Se ingreso nuevo entregable  " );
      }, error => this.showError(), () => this.showSuccess("¡Ingreso de datos exitoso!!"));
    }else{
      this.entregableService.putEntregable(data).subscribe(entregable => {
        this.crearHistorial("Se modifico el entregable " );
      }, error => this.showError(), () => this.showSuccess("¡Cambio de datos exitoso!!"));
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

  upLoadFile(row){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';

    const dialogRef = this.dialogForm.open(DeliverableFileDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          row.ID = row.id;
          row.dt_fechaRealEntregable = data.dt_fechaRealEntregable;
          row.txt_archivoEntregable = data.txt_archivoEntregable;
          row.dt_fechaUltimoCambio = data.dt_fechaUltimoCambio;
          this.updateDeliverable(row)
        }        
      }
    );
  }

  updateDeliverable(data: any){
    let entregable;
    this.crearHistorial("Se ingreso el archivo del entregable ");
    this.entregableService.putEntregable(data).subscribe(item => entregable = item, error => this.showError(), () => this.showSuccess("¡¡ Ingreso de Datos Exitoso !!"));    
  }

  deleteConfirm(rowId: string){
    if (confirm("Seguro que desea eliminar este registro?")) {
      this.entregableService.deleteEntregable(rowId).subscribe(() => this.showSuccess('Elemento eliminado'));
    }
  }

}

