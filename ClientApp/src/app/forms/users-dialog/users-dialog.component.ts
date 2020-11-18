import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CatalogService } from 'src/app/views/setting/catalog/catalog.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-users-dialog',
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.css']
})
export class UsersDialogComponent implements OnInit {

  displayedColumns: string[] = ['txt_username', 'txt_apellido', 'txt_nombre'];
  displayedColumns1: string[] = ['usuario', 'nombre', 'apellido'];
  dataSource: any;
  usersRol: any;
  userRolTemp: any;
  uas: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private catalogoService: CatalogService,
    private dialogRef: MatDialogRef<UsersDialogComponent>, @Inject(MAT_DIALOG_DATA) public op
  ) {
    this.catalogoService.getUsersRol().subscribe((items) => {
      this.usersRol = items;
      console.log(this.usersRol);
    });
   }

  ngOnInit(): void {        
    this.createForm();
  }

  createForm(){
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
    this.catalogoService.getAllUsers().subscribe( (item) => {
      console.log(item);
      let result: any;    
      if(this.op===2){        
        let uas = new Array();
        this.usersRol.forEach(element => {
          if(element.nombreRol==='Usuario-UAS'){
            uas.push(element);
          }
        });
        this.dataSource.data = uas;
      }else{
        result = item.filter(x => !this.usersRol.some(y => x.id === y.id));
        console.log(result);
        this.dataSource.data = result;
      }
      this.dataSource.paginator = this.paginator;
    })
  }

  optionSelected(row){
    this.dialogRef.close(row);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
