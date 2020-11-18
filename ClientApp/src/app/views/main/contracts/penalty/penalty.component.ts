import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PenaltyService } from './penalty.service';
import { PenaltiesDialogComponent } from 'src/app/forms/penalties-dialog/penalties-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Multa } from 'src/app/model.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RecordService } from '../../record/record.service';
import { SecurityService } from 'src/app/services/security.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-penalty',
  templateUrl: './penalty.component.html'
})
export class PenaltyComponent implements OnInit {
  displayedColumns: string[] = ['txt_codigoInforme', 'tipoMulta', 'vm_montoMulta', 'dt_fechaMulta'];

  columnas = [
    { title: "Código de Informe", name: "txt_codigoInforme" },
    { title: "Tipo de Multa", name: "tipoMulta" },
    { title: "Valor de Multa", name: "vm_montoMulta" },
    { title: "Fecha de Multa", name: "dt_fechaMulta" }
  ];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  dataSource: any;
  contratoActivo: any;
  formHistorial: FormGroup;
  userAuth: any;

  constructor(
    private multaService: PenaltyService,
    private historialService: RecordService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private dialogForm: MatDialog,
    private securityService: SecurityService
    ) {
  }

  ngOnInit() {
    this.userAuth = this.securityService.GetAuthUser();
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
    this.cargarDatos();
  }

  cargarDatos(){
    this.multaService.getMultasByContrato(this.contratoActivo.id).subscribe(data => {
      console.log("Datos Multa: ",data);
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
    openFormDialog(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '500px';
  
      const dialogRef = this.dialogForm.open(PenaltiesDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
        data => {
          if(data){
            this.createForm(data)
          }        
        }
      );
    }
  
    createForm(data: any) {
      console.log(JSON.stringify(data)); 
      let multa: Multa;
      this.crearHistorial("Se ingreso una multa por $"+data.vm_montoMulta+" del informe "+data.txt_codigoInforme);
      this.multaService.postMulta(data).subscribe(multaDesdeWS => multa = multaDesdeWS, error => this.showError(), () => this.showSuccess("¡Ingreso de dato exitoso!!"));
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
      txt_seccionHistorial: "Forma de Pago",
      txt_accionHistorial: mensaje,
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id
    });
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


/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
