import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CatalogService } from '../catalog/catalog.service';
import { UserRolDialogComponent } from 'src/app/forms/user-rol-dialog/user-rol-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  displayedColumns: string[] = ['Usuario', 'Nombre', 'NombreRol','Modificar']; 

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  dataSource: any;
  userAuth: any;
  
  public usersrol: any;
  public nuevoUserRol: any;

  constructor(
    private catalogoService: CatalogService, 
    private toastr: ToastrService,
    private dialogForm: MatDialog
  ) { }

  ngOnInit(): void {

    this.cargarDatos();
  }

  cargarDatos(){
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
    this.catalogoService.getUsersRol().subscribe(data => {
      if(data!=  null){
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      }      
    }, error => console.log("Error: " + error));
  }

  //Metodo dialog form
  openFormDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';

    const dialogRef = this.dialogForm.open(UserRolDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.createForm(data)
        }        
      }
    );
  }

  createForm(data: any) {
    let userRol;
    this.catalogoService.postUserRol(data).subscribe(item => userRol = item, error => this.showError(), () => this.showSuccess("¡¡ Ingreso de Datos Exitoso !!"));
    
  }

  //Metodo para filtrar
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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