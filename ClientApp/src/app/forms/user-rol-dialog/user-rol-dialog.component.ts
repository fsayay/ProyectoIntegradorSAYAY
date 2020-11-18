import { Component, OnInit, Inject } from '@angular/core';
import { Rol } from 'src/app/model.component';
import { TitleCasePipe } from '@angular/common';
import { CatalogService } from 'src/app/views/setting/catalog/catalog.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersDialogComponent } from '../users-dialog/users-dialog.component';

@Component({
  selector: 'app-user-rol-dialog',
  templateUrl: './user-rol-dialog.component.html',
  styleUrls: ['./user-rol-dialog.component.css']
})
export class UserRolDialogComponent implements OnInit {

  roles: Rol;
  formGroup: FormGroup;
  rol: Rol;

  constructor(
    private catalogoService: CatalogService,
    private formBuilder: FormBuilder,
    private titlecasePipe: TitleCasePipe,   
    private dialogRef: MatDialogRef<UserRolDialogComponent>, @Inject(MAT_DIALOG_DATA) data,
    private dialogForm: MatDialog
  ) { 
    this.catalogoService.getRol().subscribe( (items) => {
      const result = items.filter(x => x.txt_rolName!=='Administrador-Contrato');
      this.roles = result;
    });
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.formGroup = this.formBuilder.group({
      userID: ['', Validators.required],
      rolID: ['', Validators.required],
      usuario: ['', Validators.required]
    });
  }

  //Metodo dialog form
  openFormDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = 1;

    const dialogRef = this.dialogForm.open(UsersDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.inputValue(data)
        }        
      }
    );
  }

  inputValue(data: any){
    this.formGroup.get('usuario').setValue(this.titlecasePipe.transform(data.txt_nombre +' '+data.txt_apellido));
    this.formGroup.get('userID').setValue(data.id);
  }

  onSubmit(){
    console.log(this.formGroup.value);
    this.dialogRef.close(this.formGroup.value);
  }
}
