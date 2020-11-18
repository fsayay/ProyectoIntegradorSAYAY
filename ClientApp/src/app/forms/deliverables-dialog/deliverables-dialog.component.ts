import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CatalogService } from 'src/app/views/setting/catalog/catalog.service';
import { Tipo } from 'src/app/model.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-deliverables-dialog',
  templateUrl: './deliverables-dialog.component.html',
  styleUrls: ['./deliverables-dialog.component.css']
})
export class DeliverablesDialogComponent implements OnInit {

  minDate: Date;
  maxDate: Date; 
  public response: {dbPath: ''}; 
  fileName: string="";
  isUploadFile: boolean;

  filtro = (d: Date | null): boolean => {
    const day = ( d || new Date()).getDay();
    return day !== 0 && day !== 6;
  }

  title: string;
  formGroup: FormGroup;
  contratoActivo: any;
  tiposEntregable: Tipo[];

  constructor(
    private formBuilder: FormBuilder,
    private catalogoService: CatalogService,
    private dialogRef: MatDialogRef<DeliverablesDialogComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private datePipe: DatePipe
  ) { 
    let contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));

    this.minDate = new Date(contratoActivo.dt_fechaInicio);
    this.maxDate = new Date(contratoActivo.dt_fechaFin);
    this.catalogoService.getItem(7).subscribe(item => {
      this.tiposEntregable = item.tipos;
    })
  }

  ngOnInit(): void {
    this.isUploadFile = false;
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.createForm();
    if(this.data){
      this.title = "Modificar Entregable";
      this.formGroup.patchValue(this.data);
      this.formGroup.get('ID').setValue(this.data.id);
      if(this.data.txt_archivoEntregable){
        this.isUploadFile = true;
        this.fileName = this.getFilePath(this.data.txt_archivoEntregable);
      }      
    }else{
      this.title = "Nuevo Entregable";      
    }
    
    
  }

  private createForm() {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formGroup = this.formBuilder.group({
      ID: 0,
      qn_tipoEntregable: ['', Validators.required],
      qn_cantidadEntregable: ['', Validators.required],
      dt_fechaEntregable: ['', Validators.required],
      dt_fechaRealEntregable: today,
      txt_archivoEntregable: null,
      txt_descripcionEntregable: ['', Validators.required],
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id
    });
  }

  getFilePath(filePath: string) {
    const tempFileName = filePath.split('/');
    const nameFile = tempFileName[tempFileName.length - 1];
    return nameFile;
  }

  public uploadFinished = (event) => {
    this.response = event;
    this.formGroup.get('txt_archivoEntregable').setValue(this.response.dbPath.replace(/\\/g, "/"));
    this.fileName = this.getFilePath(this.formGroup.get('txt_archivoEntregable').value);
  }

  onSubmit() {    
    this.formGroup.get('dt_fechaEntregable').setValue(this.datePipe.transform(this.formGroup.get('dt_fechaEntregable').value, "yyyy-MM-dd"));
    this.dialogRef.close(this.formGroup.value);
  }
}
