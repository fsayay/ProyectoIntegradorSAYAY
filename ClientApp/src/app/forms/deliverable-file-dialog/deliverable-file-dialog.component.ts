import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-deliverable-file-dialog',
  templateUrl: './deliverable-file-dialog.component.html',
  styleUrls: ['./deliverable-file-dialog.component.css']
})
export class DeliverableFileDialogComponent implements OnInit {

  formGroup: FormGroup;
  response: {dbPath: ''};
  minDate: Date;
  maxDate: Date;

  filtro = (d: Date | null): boolean => {
    const day = ( d || new Date()).getDay();
    return day !== 0 && day !== 6;
  }

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DeliverableFileDialogComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private datePipe: DatePipe
  ) { 
    let contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    
    this.minDate = new Date(contratoActivo.dt_fechaInicio);
    this.maxDate = new Date(contratoActivo.dt_fechaFin);
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formGroup = this.formBuilder.group({
      dt_fechaRealEntregable: ['', Validators.required],
      txt_archivoEntregable: ['', Validators.required],
      dt_fechaUltimoCambio: today
    })
  }

  public uploadFinished = (event) => {
    this.response = event;
    this.formGroup.get('txt_archivoEntregable').setValue(this.response.dbPath.replace(/\\/g, "/"));
  }

  onSubmit(){    
    this.formGroup.get('dt_fechaRealEntregable').setValue(this.datePipe.transform(this.formGroup.get('dt_fechaRealEntregable').value, "yyyy-MM-dd"));
    this.dialogRef.close(this.formGroup.value);
  }  
}

