import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cur-dialog',
  templateUrl: './cur-dialog.component.html',
  styleUrls: ['./cur-dialog.component.css']
})
export class CurDialogComponent implements OnInit {

  formGroup: FormGroup;
  response: {dbPath: ''};

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CurDialogComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formGroup = this.formBuilder.group({
      dt_realPago: ['', Validators.required],
      txt_comprobantePago: ['', Validators.required],
      txt_archivoPago: ['', Validators.required],
      dt_fechaUltimoCambio: today
    })
  }

  public uploadFinished = (event) => {
    this.response = event;
    this.formGroup.get('txt_archivoPago').setValue(this.response.dbPath.replace(/\\/g, "/"));
  }

  onSubmit(){
    
    this.formGroup.get('dt_realPago').setValue(this.datePipe.transform(this.formGroup.get('dt_realPago').value, "yyyy-MM-dd"));
    this.dialogRef.close(this.formGroup.value);
  }

}
