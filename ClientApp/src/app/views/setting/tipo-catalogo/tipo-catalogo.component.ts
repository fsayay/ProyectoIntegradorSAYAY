import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Tipo, Seccion } from 'src/app/model.component';
import { CatalogService } from '../catalog/catalog.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { TypeDialogComponent } from 'src/app/forms/type-dialog/type-dialog.component';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tipo-catalogo',
  templateUrl: './tipo-catalogo.component.html',
  styleUrls: ['./tipo-catalogo.component.css']
})
export class TipoCatalogoComponent implements OnInit {

  public tipos: any[];
  public categoriaActual: Seccion;

  displayedColumns: string[] = ['txt_nombreTipo', 'txt_detalleTipo', 'Modificar'];
  dataSource: any;
  
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    private dialogForm: MatDialog,
    private catalogoService: CatalogService, 
    private toastr: ToastrService,
    private router: Router
    ) { }

  ngOnInit() {
    this.categoriaActual = this.catalogoService.getCategoriaActual();
    console.log(this.categoriaActual);
    this.cargarDatos()
  }

  cargarDatos(){
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
    this.dataSource.data = this.categoriaActual.tipos;
    this.dataSource.paginator = this.paginator;
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
    const dialogRef = this.dialogForm.open(TypeDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.createForm(data)
        }        
      }
    );
  }

  createForm(data: any) {
    if(data.tipoID === 0){
      data.seccionID = this.categoriaActual.seccionID;  
      this.catalogoService.postTipo(data).subscribe( () => this.showSuccess("¡Ingreso de datos exitoso!!"));
    }else{
      this.catalogoService.putTipo(data).subscribe(() => this.showSuccess("¡Cambio de datos exitoso!!"));
    }      
  }
  // Metodo para decirle al usuario que todo salio correcto
  showSuccess(mensaje: string) {
    this.toastr.success(mensaje, 'Success!');
    this.router.navigate(["/Configuracion/"]);
    //this.catalogoService.getSec(this.categoriaActual.seccionID.toString()).subscribe(tiposDesdeWS => this.categoriaActual = tiposDesdeWS, error => console.error(error), () => this.cargarDatos());    
  }

  showError() {
    this.toastr.error('A ocurrido un error en el servidor!', 'Error!');
  }
}


