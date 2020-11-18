import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-catalog-dialog',
  templateUrl: './catalog-dialog.component.html',
  styleUrls: ['./catalog-dialog.component.css']
})
export class CatalogDialogComponent implements OnInit {
  title: string;
  formGroup: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<CatalogDialogComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
    if(this.data)
    {
      this.title = "Modificar Proveedor";
      this.formGroup.patchValue(this.data);
      this.formGroup.get('seccionID').setValue(this.data.seccionID);
    }else
    {
      this.title = "Nuevo Proveedor"
    }
  }

  createForm(){
    this.formGroup = this.formBuilder.group({
      seccionID: 0,
      txt_nombreSeccion: ['', Validators.required],
      txt_detalleSeccion: ['', Validators.required],
      bol_estadoSeccion: 1
    });
  }


  onSubmit() {
    //console.log(this.formGroup.value)
    this.dialogRef.close(this.formGroup.value);
  }

}
