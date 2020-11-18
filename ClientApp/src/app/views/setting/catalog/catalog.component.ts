import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Seccion } from 'src/app/model.component';
import { CatalogService } from './catalog.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CatalogDialogComponent } from 'src/app/forms/catalog-dialog/catalog-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  displayedColumns: string[] = ['txt_nombreSeccion', 'txt_detalleSeccion', 'SubTipos', 'Modificar'];
  dataSource: any;
  
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    private router: Router,    
    private dialogForm: MatDialog,
    private catalogoService: CatalogService, 
    private toastr: ToastrService
    ) { }

  ngOnInit() {
    this.cargarDatos()
  }

  cargarDatos(){
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
    this.catalogoService.getItems().subscribe(data => {
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
    const dialogRef = this.dialogForm.open(CatalogDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.createForm(data)
        }        
      }
    );
  }

  createForm(data: any) {
    if(data.seccionID === 0){      
      this.catalogoService.postSeccion(data).subscribe( () => this.showSuccess("¡Ingreso de datos exitoso!!"));
    }else{
      this.catalogoService.putSeccion(data).subscribe(() => this.showSuccess("¡Cambio de datos exitoso!!"));
    }      
  }

  //Metodo para filtrar
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  mostrarTipos(categoria: Seccion) {
    this.catalogoService.setCategoria(categoria);
    this.router.navigate(["/Catalogo/Tipos"]);
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