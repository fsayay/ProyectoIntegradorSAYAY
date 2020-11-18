import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rol-dialog',
  templateUrl: './rol-dialog.component.html',
  styleUrls: ['./rol-dialog.component.css']
})
export class RolDialogComponent implements OnInit {

  title: string;

  formGroup: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<RolDialogComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
    if(this.data)
    {
      this.title = "Modificar Rol "+ this.data.txt_rolName;
      this.formGroup.patchValue(this.data);
      this.formGroup.get('seccionID').setValue(this.data.tipoID);
    }else
    {
      this.title = "Nuevo Rol de Usuario"
    }
  }

  createForm(){
    this.formGroup = this.formBuilder.group({
      ID: 0,
      txt_rolName: ['', Validators.required],
      txt_rolDetaile: ['', Validators.required]
    });
  }


  onSubmit() {
    this.dialogRef.close(this.formGroup.value);
  }

}
