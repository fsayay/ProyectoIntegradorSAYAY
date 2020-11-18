import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProceedingsDialogComponent } from 'src/app/forms/proceedings-dialog/proceedings-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProveedorService } from './proveedor.service';
import { ProveedorDialogComponent } from 'src/app/forms/proveedor-dialog/proveedor-dialog.component';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {
  displayedColumns: string[];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  dataSource: any;
  contratoActivo: any;
  formHistorial: FormGroup;
  userAuth: any;

  constructor(
    private toastr: ToastrService,
    private proveedorService: ProveedorService,
    private dialogForm: MatDialog
    ) {
    this.displayedColumns = ['txt_nombreProveedor', 'txt_rucProveedor', 'txt_descripcionProveedor', 'Modificar', 'Eliminar'];
     
  }

  ngOnInit() {
    this.cargarDatos();    
  }

  cargarDatos(){
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
    this.proveedorService.getProveedor().subscribe(data => {
      if(data!=  ''){
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
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
      const dialogRef = this.dialogForm.open(ProveedorDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
        data => {
          if(data){
            this.createForm(data)
          }        
        }
      );
    }
  
    createForm(data: any) {      
      if(data.ID === 0){      
        this.proveedorService.postProveedor(data).subscribe( () => this.showSuccess("¡Ingreso de datos exitoso!!"));
      }else{
        this.proveedorService.putProveedor(data).subscribe(() => this.showSuccess("¡Cambio de datos exitoso!!"));
      }      
    }
    //Instancia para el historial
  
  deleteConfirm(Id: string){
    if (confirm("Seguro que desea eliminar este registro?")) {
      this.proveedorService.deleteProveedor(Id).subscribe(() => this.showSuccess('Elemento eliminado'));
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

