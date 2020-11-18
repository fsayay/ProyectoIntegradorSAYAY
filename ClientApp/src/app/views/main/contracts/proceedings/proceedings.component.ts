import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProceedingsService } from './proceedings.service';
import { ProceedingsDialogComponent } from 'src/app/forms/proceedings-dialog/proceedings-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Acta } from 'src/app/model.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RecordService } from '../../record/record.service';
import { PdfLoaderComponent } from 'src/app/sharedService/pdf-loader/pdf-loader.component';
import { SecurityService } from 'src/app/services/security.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-proccedings',
  templateUrl: './proceedings.component.html'
})
export class ProceedingsComponent implements OnInit {
  displayedColumns: string[];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  dataSource: any;
  contratoActivo: any;
  formHistorial: FormGroup;
  userAuth: any;

  constructor(
    private actaService: ProceedingsService,
    private historialService: RecordService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private securityService: SecurityService,
    private dialogForm: MatDialog) {
      this.userAuth = this.securityService.GetAuthUser();
      if(this.userAuth.rol==="Administrador-Contrato"){
        this.displayedColumns = ['txt_codigoActa', 'tipoActa', 'dt_fechaActa', 'txt_archivoActa', 'Modificar', 'Eliminar'];
      }else{
        this.displayedColumns = ['txt_codigoActa', 'tipoActa', 'dt_fechaActa', 'txt_archivoActa'];
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
    this.actaService.getActasByContrato(this.contratoActivo.id).subscribe(data => {
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
        console.log(data);
        dialogConfig.data = data;
      }
      const dialogRef = this.dialogForm.open(ProceedingsDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
        data => {
          if(data){
            this.createForm(data)
          }        
        }
      );
    }
  
    createForm(data: any) {
      let acta: Acta;
      this.crearHistorial("Se ingreso nueva acta con código "+data.txt_codigoActa);
      if(data.ID === 0){      
        this.actaService.postActa(data).subscribe(garantiaDesdeWS => {
          this.crearHistorial("Se ingreso nueva Acta con codigo " + data.txt_codigoActa);          
        }, error => this.showError(), () => this.showSuccess("¡Ingreso de datos exitoso!!"));
      }else{
        this.actaService.putActa(data).subscribe(garantiaDesdeWS => {
          this.crearHistorial("Se modifico la acta con codigo " + data.txt_codigoActa);
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
      txt_seccionHistorial: "Acta",
      txt_accionHistorial: mensaje,
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id
    });
  }

  deleteConfirm(rowId: string){
    if (confirm("Seguro que desea eliminar este registro?")) {
      this.actaService.deleteActa(rowId).subscribe(() => this.showSuccess('Elemento eliminado'));
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
    console.log(url);
    const modalRef = this.modalService.open(PdfLoaderComponent, { size: 'xl' });
    modalRef.componentInstance.filePath = url;
  }
}


/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */

