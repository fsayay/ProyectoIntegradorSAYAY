import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CatalogService } from 'src/app/views/setting/catalog/catalog.service';
import { Tipo, Contrato } from 'src/app/model.component';
import { formatCurrency, getCurrencySymbol, DatePipe } from '@angular/common';


@Component({
  selector: 'app-payments-dialog',
  templateUrl: './payments-dialog.component.html',
  styleUrls: ['./payments-dialog.component.css']
})
export class PaymentsDialogComponent implements OnInit {

  title: string;
  contratoActivo: Contrato;
  formGroup: FormGroup;
  tiposPago: Tipo[];

  montoContrato: number;

  // variables para tipo Contra Entrega
  public porcentajeContraEntrega: string = '0';
  public k: number;
  
  // variables para tipo Parcial
  public totalPorcentaje: number;
  public esParcial: boolean;
  public i: number;


  constructor(
    private formBuilder: FormBuilder,
    private catalogoService: CatalogService,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<PaymentsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data
  ) { 
    this.catalogoService.getItem(4).subscribe(item => {
      this.tiposPago = item.tipos;
    })
  }

  ngOnInit() {
    this.i = 0;
    this.k = 0;
    this.title = "Forma de Pago";
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.montoContrato = this.contratoActivo.vm_montoAdjudicado;
    this.createForm();
  }

  private createForm() {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formGroup = this.formBuilder.group({
      ID: 0,
      qn_tipoPago: ['', Validators.required],
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id,
      pagos: this.formBuilder.array([])
    });    
  }

  construirFormPago() {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    return this.formBuilder.group({
      ID: 0,
      qn_porcentajePago: ['', Validators.required],
      bol_esAnticipo: false,
      qn_numeroPago: '',
      vm_montoPago: ['', Validators.required],
      dt_tentativaPago: ['', Validators.required],
      dt_realPago: '',
      txt_comprobantePago: null,
      txt_archivoPago: '',
      dt_fechaUltimoCambio: today,
      formaPagoID: 0
    })
  }

  setTipoPago(tipo: Tipo) { // # pagos parcial
    
    if ( this.i > 0) {       
      while (this.i>0) {        
        this.eliminarFormPagos(this.i-1);
        this.i--;
      }
    }
    if (tipo.txt_nombreTipo == "Contra Entrega") {
      this.esParcial = false;
      let numeroPago = 0;
      this.i = this.i + 1;
      this.porcentajeContraEntrega = '100';
      numeroPago = this.i;
      let pagoArr = this.formGroup.get('pagos') as FormArray;
      let pagoFormGroup = this.construirFormPago();
      pagoFormGroup.get('vm_montoPago').setValue(this.contratoActivo.vm_montoAdjudicado);
      pagoFormGroup.get('qn_porcentajePago').setValue(this.porcentajeContraEntrega);
      pagoFormGroup.get('qn_numeroPago').setValue(this.i);
      pagoArr.push(pagoFormGroup);        
            
    }
    else {
      this.totalPorcentaje = 0;
      this.esParcial = true;
    }
    console.log(this.formGroup);
  }

   agregarPago() {
    this.i = this.i + 1;
    let pagoArr = this.formGroup.get('pagos') as FormArray;
    let pagoFormGroup = this.construirFormPago();
    pagoArr.push(pagoFormGroup);    
  }

  eliminarFormPagos(index: number) {
    (<FormArray>this.formGroup.controls['pagos']).removeAt(index);
    //this.formGroup.removeControl("pagos");
    //this.formGroup.addControl("pagos",[]);
  }

  updateValue(value: string, i: number) {
    let monto = 0;
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    if (val > 100) {
      val = 0; 
    } else {
      //val = val / 100;
      this.totalPorcentaje = this.totalPorcentaje + val;
      if(this.totalPorcentaje > 100){   
        this.totalPorcentaje = this.totalPorcentaje - val;             
        val = 0;
      }
      monto = (this.montoContrato * val)/100 ;
      
    }    
    const arreglo = this.getControls();
    arreglo[i].get('vm_montoPago').setValue(formatCurrency(monto, 'en-US', getCurrencySymbol('USD', 'wide')));
    arreglo[i].get('qn_porcentajePago').setValue(val);    
  }

  getControls() {
    return (this.formGroup.get('pagos') as FormArray).controls;
  }
  
  save() {
    this.dialogRef.close(this.formGroup.value);
  }  
}
