import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CatalogService } from 'src/app/views/setting/catalog/catalog.service';
import { Tipo } from 'src/app/model.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reports-dialog',
  templateUrl: './reports-dialog.component.html',
  styleUrls: ['./reports-dialog.component.css']
})
export class ReportsDialogComponent implements OnInit {

  title: string;
  anotherType: boolean;
  formGroup: FormGroup;
  tiposInforme: Tipo[];
  contratoActivo: any;
  public response: {dbPath: ''};
  fileName: string="";


  constructor(
    private formBuilder: FormBuilder,
    private catalogoService: CatalogService,
    private dialogRef: MatDialogRef<ReportsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private datePipe: DatePipe
  ) { 
    this.catalogoService.getItem(3).subscribe( item => {
      this.tiposInforme = item.tipos;
    })
  }

  ngOnInit() {
    this.anotherType = false;
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.createForm();
    if(this.data){
      this.title = "Modificar Informe";
      this.formGroup.patchValue(this.data);
      this.formGroup.get('ID').setValue(this.data.id);
      this.fileName = this.getFilePath(this.data.txt_archivoInforme);
    }else{
      this.title = "Nuevo Informe";       
    }    
  }

  private createForm() {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formGroup = this.formBuilder.group({
      ID: 0,
      qn_tipoInforme: ['', Validators.required],
      //txt_nombreTipo: ['', Validators.required],
      txt_codigoInforme: ['', Validators.required],
      dt_fechaInforme: ['', Validators.required],
      txt_archivoInforme: ['', Validators.required],
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id
    });
  }

  selectedType(tipo: any){
    if(tipo.txt_nombreTipo == "Otros")
      this.anotherType = true;
    else
      this.anotherType = false;
  }

  public uploadFinished = (event) => {
    this.response = event;
    this.formGroup.get('txt_archivoInforme').setValue(this.response.dbPath.replace(/\\/g, "/"));
    this.fileName = this.getFilePath(this.formGroup.get('txt_archivoInforme').value);
  }

  getFilePath(filePath: string) {
    const tempFileName = filePath.split('/');
    const nameFile = tempFileName[tempFileName.length - 1];
    return nameFile;
  }

  onSubmit() {    
    this.formGroup.get('dt_fechaInforme').setValue(this.datePipe.transform(this.formGroup.get('dt_fechaInforme').value, "yyyy-MM-dd"));
    this.dialogRef.close(this.formGroup.value);
  }
}
