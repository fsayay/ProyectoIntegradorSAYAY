import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogService } from '../catalog/catalog.service';
import { ToastrService } from 'ngx-toastr';
import { Rol } from 'src/app/model.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { RolDialogComponent } from 'src/app/forms/rol-dialog/rol-dialog.component';
import { CatalogDialogComponent } from 'src/app/forms/catalog-dialog/catalog-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {

  public tipos: any[];

  displayedColumns: string[] = ['txt_rolName', 'txt_rolDetaile', 'Modificar'];
  dataSource: any;
  
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    private catalogoService: CatalogService, 
    private toastr: ToastrService,
    private dialogForm: MatDialog
    ) { }

  ngOnInit() {
    this.cargarDatos()
  }

  cargarDatos(){
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
    this.catalogoService.getRol().subscribe(data => {
      if(data!=  null){
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      }      
    }, error => console.log("Error: " + error));
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
    const dialogRef = this.dialogForm.open(RolDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.createForm(data)
        }        
      }
    );
  }

  //Metodo para filtrar
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  createForm(data: any) {
    if(data.ID === 0){      
      this.catalogoService.postRol(data).subscribe( () => this.showSuccess("¡Ingreso de datos exitoso!!"));
    }else{
      this.catalogoService.putRol(data).subscribe(() => this.showSuccess("¡Cambio de datos exitoso!!"));
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
