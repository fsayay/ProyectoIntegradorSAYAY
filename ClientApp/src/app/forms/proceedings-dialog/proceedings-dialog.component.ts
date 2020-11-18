import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CatalogService } from 'src/app/views/setting/catalog/catalog.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tipo } from 'src/app/model.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-proceedings-dialog',
  templateUrl: './proceedings-dialog.component.html',
  styleUrls: ['./proceedings-dialog.component.css']
})
export class ProceedingsDialogComponent implements OnInit {

  formGroup: FormGroup;
  title: string;
  tiposActa: Tipo[];
  contratoActivo: any;
  public response: {dbPath: ''};
  fileName: string="";

  constructor(
    private formBuilder: FormBuilder,
    private catalogoService: CatalogService,
    private dialogRef: MatDialogRef<ProceedingsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private datePipe: DatePipe
  ) { 
    this.catalogoService.getItem(6).subscribe(item => {
      this.tiposActa = item.tipos;
    })
  }

  ngOnInit() {
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.createForm();
    if(this.data){
      this.title = "Modificar Acta";
      this.formGroup.patchValue(this.data);
      this.formGroup.get('ID').setValue(this.data.id);
      this.fileName = this.getFilePath(this.data.txt_archivoActa);
    }else{
      this.title = "Nueva Acta";       
    }    
  }

  private createForm() {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formGroup = this.formBuilder.group({
      ID: 0,
      qn_tipoActa: ['', Validators.required],
      txt_codigoActa: ['', Validators.required],
      dt_fechaActa: ['', Validators.required],
      txt_archivoActa: ['', Validators.required],
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id
    });
  }

  public uploadFinished = (event) => {
    this.response = event;
    this.formGroup.get('txt_archivoActa').setValue(this.response.dbPath.replace(/\\/g, "/"));    
    this.fileName = this.getFilePath(this.formGroup.get('txt_archivoActa').value);
  }
  
  onSubmit() {
    this.formGroup.get('dt_fechaActa').setValue(this.datePipe.transform(this.formGroup.get('dt_fechaActa').value, "yyyy-MM-dd"));
    this.dialogRef.close(this.formGroup.value);
  }

  getFilePath(filePath: string) {
    const tempFileName = filePath.split('/');
    const nameFile = tempFileName[tempFileName.length - 1];
    return nameFile;
  }

}
