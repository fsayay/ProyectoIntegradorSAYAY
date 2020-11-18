import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-type-dialog',
  templateUrl: './type-dialog.component.html',
  styleUrls: ['./type-dialog.component.css']
})
export class TypeDialogComponent implements OnInit {
  title: string;
  formGroup: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<TypeDialogComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
    if(this.data)
    {
      console.log(this.data);
      this.title = "Modificar Tipo";
      this.formGroup.patchValue(this.data);
      this.formGroup.get('seccionID').setValue(this.data.seccionID);
    }else
    {
      this.title = "Nuevo Tipo"
    }
  }

  createForm(){
    this.formGroup = this.formBuilder.group({
      tipoID: 0,
      txt_nombreTipo: ['', Validators.required],
      txt_detalleTipo: ['', Validators.required],
      seccionID: 0
    });
  }


  onSubmit() {
    console.log(this.formGroup.value);
    this.dialogRef.close(this.formGroup.value);
  }

}
