import { Component, OnInit, Inject } from '@angular/core';
import { Contrato, Tipo } from 'src/app/model.component';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatCurrency, getCurrencySymbol, DatePipe } from '@angular/common';
import { CatalogService } from 'src/app/views/setting/catalog/catalog.service';

@Component({
  selector: 'app-update-pay',
  templateUrl: './update-pay.component.html',
  styleUrls: ['./update-pay.component.css']
})
export class UpdatePayComponent implements OnInit {

  title: string;
  tiposPago: Tipo[];
  total: number;
  contratoActivo: Contrato;
  formGroup: FormGroup;
  formPago: FormGroup;
  isDisabled: boolean;
  deleteOption: boolean;
  public response: {dbPath: ''};
  fileName: string="";

  montoContrato: number;
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private catalogoService: CatalogService,
    private dialogRef: MatDialogRef<UpdatePayComponent>, @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.catalogoService.getItem(4).subscribe(item => {
      this.tiposPago = item.tipos;
    })
   }

  ngOnInit(): void {
    this.isDisabled = false;
    this.deleteOption = this.isDisabled;
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.montoContrato = this.contratoActivo.vm_montoAdjudicado;
    this.createForm();
    this.total = 0;
    if(this.data.data.filteredData)
    {            
      this.title = "Nuevo Pago Parcial";
      this.formGroup.get('qn_tipoPago').setValue(this.data.data.filteredData[0].qn_tipoPago);
      this.formGroup.get('ID').setValue(this.data.data.filteredData[0].formaPagoID);
      this.formGroup.get('formaPagoID').setValue(this.data.data.filteredData[0].formaPagoID);
      this.formGroup.get('vm_montoPago').setValue(formatCurrency(this.data.data.filteredData[0].vm_montoPago, 'en-US', getCurrencySymbol('USD', 'wide')));
      this.data.data.filteredData.forEach(pago => {
        this.total = this.total + pago.qn_porcentajePago;
      });
    }
    else{
      this.title = "Modificar Pago "+ this.data.data.tipoPago;;
      this.formGroup.get('ID').setValue(this.data.data.formaPagoID);
      this.formGroup.get('qn_tipoPago').setValue(this.data.data.qn_tipoPago);
      this.formGroup.get('pagoID').setValue(this.data.data.id);
      this.formGroup.get('vm_montoPago').setValue(formatCurrency(this.data.data.vm_montoPago, 'en-US', getCurrencySymbol('USD', 'wide')));
      this.data.dataSource.filteredData.forEach(pago => {
        this.total = this.total + pago.qn_porcentajePago;
      });
      this.total = this.total - this.data.data.qn_porcentajePago;
      this.formGroup.patchValue(this.data.data);
    }    
    
    if(this.data.data.txt_archivoPago){
      this.fileName = this.getFilePath(this.data.data.txt_archivoPago);
      this.isDisabled = true;
      this.deleteOption = this.isDisabled;
    }
  }

  createForm() {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formGroup = this.formBuilder.group({
      ID: 0,
      qn_tipoPago: ['', Validators.required],
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id,
      pago: [],
      pagoID: 0,
      qn_porcentajePago: ['', Validators.required],
      bol_esAnticipo: false,
      vm_montoPago: ['', Validators.required],
      dt_tentativaPago: ['', Validators.required],
      dt_realPago: '',
      txt_comprobantePago: null,
      txt_archivoPago: '',
      dt_fechaUltimoCambioPago: today,
      formaPagoID: 0
    });    
  }

  deleteCur(){    
    if (confirm("Seguro que desea eliminar el CUR?")) {
      this.deleteOption = false;
      this.formGroup.get('txt_archivoPago').setValue(null);
      this.formGroup.get('txt_comprobantePago').setValue(null);
      this.formGroup.get('dt_realPago').setValue(null);
    }
  }

  public uploadFinished = (event) => {
    this.response = event;
    this.formGroup.get('txt_archivoPago').setValue(this.response.dbPath.replace(/\\/g, "/"));
    this.fileName = this.getFilePath(this.formGroup.get('txt_archivoPago').value);
  }

  getFilePath(filePath: string) {
    const tempFileName = filePath.split('/');
    const nameFile = tempFileName[tempFileName.length - 1];
    return nameFile;
  }

  updateValue(value: string) {
    let monto = 0;
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    if(this.data.data.filteredData){
      if (val > (100 - this.total)) {
        val = 0;
        this.formGroup.get('vm_montoPago').setValue(formatCurrency(0, 'en-US', getCurrencySymbol('USD', 'wide')));
        this.formGroup.get('qn_porcentajePago').setValue('');     
      }else{
        monto = (this.contratoActivo.vm_montoAdjudicado * val)/100 ;
        this.formGroup.get('vm_montoPago').setValue(formatCurrency(monto, 'en-US', getCurrencySymbol('USD', 'wide')));
        this.formGroup.get('qn_porcentajePago').setValue(val);    
      }
    }else{
      if (val > (100 - this.total)) {
        val = 0;
        this.formGroup.get('vm_montoPago').setValue(formatCurrency(this.data.data.vm_montoPago, 'en-US', getCurrencySymbol('USD', 'wide')));
        this.formGroup.get('qn_porcentajePago').setValue(this.data.data.qn_porcentajePago);     
      }else{
        monto = (this.contratoActivo.vm_montoAdjudicado * val)/100 ;
        this.formGroup.get('vm_montoPago').setValue(formatCurrency(monto, 'en-US', getCurrencySymbol('USD', 'wide')));
        this.formGroup.get('qn_porcentajePago').setValue(val);    
      }
    }   
  }
  
  save() {
    this.dialogRef.close(this.formGroup.value);
  } 

}
