import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentsService } from 'src/app/views/main/contracts/payments/payments.service';
import { DeliverablesService } from 'src/app/views/main/contracts/deliverables/deliverables.service';
import { ExpiratiosService } from 'src/app/views/main/contracts/expirations/expirations.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expirations-dialog',
  templateUrl: './expirations-dialog.component.html',
  styleUrls: ['./expirations-dialog.component.css']
})
export class ExpirationsDialogComponent implements OnInit {

  title: string;
  contratoActivo: any;
  formGroup: FormGroup;
  formArrayPagos: FormArray;
  i: number;

  formasPago: any;
  entregables: any;

  vencimientos: any[];

  isDisabledPay: boolean;
  isDisabledDeliverable: boolean;
  
  constructor(
    private pagosService: PaymentsService,
    private entregablesService: DeliverablesService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private vencimientoService: ExpiratiosService,
    private dialogRef: MatDialogRef<ExpirationsDialogComponent>, @Inject(MAT_DIALOG_DATA) data  
  ) { 
    this.createForm();
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.vencimientoService.getVencimientosByContrato(this.contratoActivo.id).subscribe(data => {
      this.pagosService.getFormaPagoByContrato(this.contratoActivo.id).subscribe((pagos) => {
        if(pagos!= ""){
          this.formasPago = pagos.filter(x => !data.some(y => x.id === y.pagoID));
          if(this.formasPago!= ""){
            this.formasPago.forEach(pago => {
              this.agregarPago(pago);
            });
          }        
        }
      });
      this.entregablesService.getEntregablesByContrato(this.contratoActivo.id).subscribe((entregables) => {
        if(entregables!= ""){
          this.entregables = entregables.filter(x => !data.some(y => x.id === y.entregableID));
          if(this.entregables!= ""){
            this.entregables.forEach(entregable => {
              this.agregarEntregable(entregable);
            });
          }        
        }
      });
    }, error => console.log("Error: " + error));    
  }

  ngOnInit() {    
    this.isDisabledPay = true;
    this.isDisabledDeliverable = true;
    this.title = "Configurar Vencimientos";
  }

  createForm(){
    this.formGroup = this.formBuilder.group({
      vencimientoPagos: this.formBuilder.array([]),
      vencimientoEntregables: this.formBuilder.array([])
    })
  }

  agregarPago(pago: any) {
    let pagoArr = this.formGroup.get('vencimientoPagos') as FormArray;
    let pagoFormGroup = this.construirVencimientoPagos(pago); 
    pagoArr.push(pagoFormGroup);    
  }

  construirVencimientoPagos(data: any) {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    return this.formBuilder.group({
      ID: 0,
      txt_nombreSeccion: "Pago",
      tipo: data.tipoPago,
      fecha: data.dt_tentativaPago,
      qn_diasAnticipacion: ['', Validators.required],
      qn_frecuenciaAnticipacion: ['', Validators.required],
      dt_fechaUltimoCambio: today,
      contratoID: data.contratoID,
      pagoID: data.id
    })
  }

  agregarEntregable(entregable: any) {
    let pagoArr = this.formGroup.get('vencimientoEntregables') as FormArray;
    let entregableFormGroup = this.construirVencimientoEntregables(entregable);    
    pagoArr.push(entregableFormGroup);    
  }

  construirVencimientoEntregables(data: any) {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    return this.formBuilder.group({
      ID: 0,
      txt_nombreSeccion: "Entregable",      
      tipo: data.tipoEntregable,
      fecha: data.dt_fechaEntregable,
      qn_diasAnticipacion: ['', Validators.required],
      qn_frecuenciaAnticipacion: ['', Validators.required],
      dt_fechaUltimoCambio: today,
      contratoID: data.contratoID,
      entregableID: data.id
    })
  }

  onChangePay(event) {
    if(event.checked){
      this.isDisabledPay = !this.isDisabledPay;
    }else{
      this.isDisabledPay = !this.isDisabledPay;
    }
  }

  onChangeDeliverable(event) {
    if(event.checked){
      this.isDisabledDeliverable = !this.isDisabledDeliverable;
    }else{
      this.isDisabledDeliverable = !this.isDisabledDeliverable;
    }
  }


  onSubmit() {
    this.dialogRef.close(this.formGroup.value);
  } 
}

