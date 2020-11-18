import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UnidadService } from './unidad.service';
import { UnidadDialogComponent } from 'src/app/forms/unidad-dialog/unidad-dialog.component';

@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.css']
})
export class UnidadComponent implements OnInit {
  displayedColumns: string[] = ['txt_nombreUnidad', 'txt_descripcionUnidad', 'txt_correoUnidad','Modificar']; 

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  dataSource: any;
  userAuth: any;

  constructor(
    private toastr: ToastrService,
    private unidadService: UnidadService,
    private dialogForm: MatDialog
    ) {   
  }

  ngOnInit() {
    this.cargarDatos();    
  }

  cargarDatos(){
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
    this.unidadService.getUnidad().subscribe(data => {
      if(data!=  ''){
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      }      
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
      const dialogRef = this.dialogForm.open(UnidadDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
        data => {
          if(data){
            this.createForm(data)
          }        
        }
      );
    }
  
    createForm(data: any) { 
      console.log(data);     
      if(data.ID === 0){      
        this.unidadService.postUnidad(data).subscribe( () => this.showSuccess("¡Ingreso de datos exitoso!!"));
      }else{
        this.unidadService.putUnidad(data).subscribe(() => this.showSuccess("¡Cambio de datos exitoso!!"));
      }      
    }
    //Instancia para el historial
  
  deleteConfirm(Id: string){
    if (confirm("Seguro que desea eliminar este registro?")) {
      this.unidadService.deleteUnidad(Id).subscribe(() => this.showSuccess('Elemento eliminado'));
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
}


/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */

