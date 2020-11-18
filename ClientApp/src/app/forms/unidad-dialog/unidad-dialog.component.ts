import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-unidad-dialog',
  templateUrl: './unidad-dialog.component.html',
  styleUrls: ['./unidad-dialog.component.css']
})
export class UnidadDialogComponent implements OnInit {

  title: string;
  formGroup: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<UnidadDialogComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.createForm();
    if(this.data)
    {
      this.title = "Modificar Unidad";
      this.formGroup.patchValue(this.data);
      this.formGroup.get('ID').setValue(this.data.id);
    }else
    {
      this.title = "Nueva Unidad"
    }

  }

  createForm(){
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formGroup = this.formBuilder.group({
      ID: 0,
      txt_nombreUnidad: ['', Validators.required],
      txt_correoUnidad: ['', Validators.required],
      txt_descripcionUnidad: ['', Validators.required],
      dt_fechaUltimoCambio: today
    });
  }


  onSubmit() {
    this.dialogRef.close(this.formGroup.value);
  }

}