import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-proveedor-dialog',
  templateUrl: './proveedor-dialog.component.html',
  styleUrls: ['./proveedor-dialog.component.css']
})
export class ProveedorDialogComponent implements OnInit {

  title: string;
  formGroup: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<ProveedorDialogComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.createForm();
    if(this.data)
    {
      this.title = "Modificar Proveedor";
      this.formGroup.patchValue(this.data);
      this.formGroup.get('ID').setValue(this.data.id);
    }else
    {
      this.title = "Nuevo Proveedor"
    }

  }

  createForm(){
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formGroup = this.formBuilder.group({
      ID: 0,
      txt_nombreProveedor: ['', Validators.required],
      txt_rucProveedor: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      txt_descripcionProveedor: ['', Validators.required],
      dt_fechaUltimoCambio: today
    });
  }


  onSubmit() {
    this.dialogRef.close(this.formGroup.value);
  }

}