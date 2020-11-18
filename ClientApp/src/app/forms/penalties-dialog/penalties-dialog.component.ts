import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CatalogService } from 'src/app/views/setting/catalog/catalog.service';
import { Tipo } from 'src/app/model.component';
import { DatePipe, formatCurrency, getCurrencySymbol } from '@angular/common';
import { InformeMultaComponent } from '../informe-multa/informe-multa.component';


@Component({
  selector: 'app-penalties-dialog',
  templateUrl: './penalties-dialog.component.html',
  styleUrls: ['./penalties-dialog.component.css']
})
export class PenaltiesDialogComponent implements OnInit {

  tiposMulta: Tipo[];
  title: string;
  formGroup: FormGroup;
  public txt_codigoInforme: string;  
  cantidad: string='0';
  contratoActivo: any;

  constructor(
    private formBuilder: FormBuilder,
    private catalogoService: CatalogService,
    private dialogRef: MatDialogRef<PenaltiesDialogComponent>, @Inject(MAT_DIALOG_DATA) data,
    private datePipe: DatePipe,
    private dialogForm: MatDialog  
    //private modalService: NgbModal 
  ) {
    this.catalogoService.getItem(5).subscribe(item =>{
      this.tiposMulta = item.tipos;
    })
   }

  ngOnInit(): void {
    this.title = "Nueva Multa";
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.createForm();
  }

  private createForm() {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formGroup = this.formBuilder.group({
      ID: 0,
      qn_tipoMulta: ['', Validators.required],
      vm_montoMulta: ['', Validators.required],
      txt_codigoInforme: ['', Validators.required],
      txt_motivoMulta: ['', Validators.required],
      dt_fechaMulta: ['', Validators.required],
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id
    });
  }

  openPenaltyReports() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialogForm.open(InformeMultaComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.asignarCodigoInforme(data);
        }        
      }
    );
  }

  asignarCodigoInforme(data: any){
    this.formGroup.get('txt_codigoInforme').setValue(data);
  }

  updateValue(value: string) {
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    this.cantidad = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
  }

  onSubmit() {
    this.formGroup.get('dt_fechaMulta').setValue(this.datePipe.transform(this.formGroup.get('dt_fechaMulta').value, "yyyy-MM-dd"));
    this.dialogRef.close(this.formGroup.value);
  } 

}
