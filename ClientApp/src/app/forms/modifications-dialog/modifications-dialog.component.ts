import { Component, OnInit, Inject } from '@angular/core';
import { CatalogService } from 'src/app/views/setting/catalog/catalog.service';
import { Tipo } from 'src/app/model.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe, formatCurrency, getCurrencySymbol } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContractListService } from 'src/app/views/main/contracts/contract-list/contract-list.service';

@Component({
  selector: 'app-modifications-dialog',
  templateUrl: './modifications-dialog.component.html',
  styleUrls: ['./modifications-dialog.component.css']
})
export class ModificationsDialogComponent implements OnInit {

  montoIncremento: any;

  tiposModificacion: Tipo[];
  titulo: string;
  detalleFecha: string;
  detalleMonto: string;
  detalleAmbos: string;
  formGroup: FormGroup;
  cantidad: string='';
  contratoActivo: any;
  isDisabled: boolean;
  readonly: boolean;
  readonlydias: boolean;
  
  public response: {dbPath: ''};

  //tipo modificatorio
  is_complementario: boolean = false;
  is_changeOrder: boolean = false;
  is_workOrder: boolean = false;
  is_modificatorio: boolean = false;
  contrato: any;
  
  constructor(
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<ModificationsDialogComponent>, @Inject(MAT_DIALOG_DATA) data,
    private formBuilder: FormBuilder,
    private contratosService: ContractListService,
    private catalogoService: CatalogService
    ) {
      this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
      this.catalogoService.getItem(8).subscribe(item => {
        const tiposModificacion = new Array();
        item.tipos.forEach(x => {
          if(this.contratoActivo.tipoContrato==='Bienes'){
            if(x.txt_nombreTipo==='Modificatorio'){
              tiposModificacion.push(x);
            }
          }
          if(this.contratoActivo.tipoContrato==='Servicios'){
            if(x.txt_nombreTipo==='Modificatorio'){
              tiposModificacion.push(x);
            }
            if(x.txt_nombreTipo==='Complementario'){
              tiposModificacion.push(x);
            }
          }
          if(this.contratoActivo.tipoContrato==='Obras'){
            tiposModificacion.push(x);            
          }
        });
        this.tiposModificacion = tiposModificacion;
      });
   }

  ngOnInit(): void {    
    this.titulo = 'Adicionales del Contrato';
    this.readonly = true;
    this.readonlydias = true;
    this.createForm();
    this.contratosService.getContratoDetalle(this.contratoActivo.id).subscribe(item => {
      this.contrato = item;
      this.formGroup.get('vm_valorActual').setValue(formatCurrency(this.contrato.montoActual, 'en-US', getCurrencySymbol('USD', 'wide')));
      this.formGroup.get('dt_fechaActual').setValue(this.datePipe.transform(this.contrato.fechaFinReal, "yyyy-MM-dd"));   
    });
    
    
    
  }

  private createForm() {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formGroup = this.formBuilder.group({
      ID: 0,                                                  //
      qn_tipoModificacion: ['', Validators.required],         //
      txt_motivoModificacion: ['', Validators.required],      //
      txt_detalleModificacion: '',                            //
      dt_fechaUltimoCambio: today,                            //
      vm_valorActual: '',
      vm_valorNuevo: '',                          //
      dt_fechaActual: '',
      dt_fechaNuevo: '',
      diasProrroga: 0,
      txt_archivoModificacion: ['', Validators.required],     //
      contratoID: this.contratoActivo.id                      //
    });
  }; 

  filtroTipo(){
    if(this.contratoActivo.tipoContrato === 'Bienes'){
      this.tiposModificacion = this.tiposModificacion.filter(x => x.txt_nombreTipo === 'Modificatorio');
    }
  }

  updateProrroga(value: string) {
    if(value != ''){
      var dias = parseInt(value);
      var fechaFin = new Date(this.datePipe.transform(this.contrato.fechaFinReal, "yyyy-MM-dd"));
      fechaFin.setDate(fechaFin.getDate() + dias);
      this.formGroup.get('dt_fechaNuevo').setValue(this.datePipe.transform(fechaFin, "yyyy-MM-dd"));
    }else{
      this.formGroup.get('dt_fechaNuevo').setValue('');
    }
    
  }

  updateValue(value: string) {
    console.log(value);
    this.cantidad = '';
    this.formGroup.get('vm_valorNuevo').setValue('');
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    if(this.is_complementario){
      let montoInicial = this.contrato.vm_montoAdjudicado;
      if(val <= 7){
        let aumento = (montoInicial * val)/100;  
        let montoTotal = montoInicial + aumento;
        this.formGroup.get('vm_valorNuevo').setValue(montoTotal);
        this.montoIncremento = formatCurrency(aumento, 'en-US', getCurrencySymbol('USD', 'wide'));
        this.cantidad = formatCurrency(aumento, 'en-US', getCurrencySymbol('USD', 'wide'));
      }
      else{
        alert("¡¡ Monto supera el 8% del valor asignado al contrato actual !!!!");
      }       
    }
    if(this.is_workOrder)
    {
      let montoInicial = this.contrato.vm_montoAdjudicado;
      let aumento = montoInicial * MAX_RUBRO;      
      if ( val > aumento ){
        alert("¡¡ Monto del rubro supera el 2% del valor asignado al contrato actual !!!!");      
        this.formGroup.get('vm_valorNuevo').setValue('');   
      }else{
        this.cantidad = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
        this.formGroup.get('vm_valorNuevo').setValue(val);
      }
    }
    if(this.is_changeOrder)
    {      
      let montoInicial = this.contrato.vm_montoAdjudicado;
      let aumento = montoInicial * MAX_CAMB;
      let montoTotal = montoInicial + aumento;
      if ( val > montoTotal ){
        alert("¡¡ La diferencia de cantidades supera el 5% del valor asignado al contrato actual !!!!");      
        this.formGroup.get('vm_valorNuevo').setValue('');   
      }else{
        this.cantidad = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
        this.formGroup.get('vm_valorNuevo').setValue(val);
      }
    }
        
  }

  onChange(event) {
    if(event.checked){
      this.readonly = !this.readonly;
    }else{
      this.formGroup.get("vm_valorNuevo").setValue('');
      this.readonly = !this.readonly;
    }
  }

  setTipoPago(tipo: Tipo) {
    this.is_workOrder = false;
    this.is_complementario = false;
    this.is_changeOrder = false;
    this.is_modificatorio = false;
    this.formGroup.get('txt_detalleModificacion').setValue('');
    if (tipo.txt_nombreTipo == "Complementario") {
      this.is_complementario = true;           
    }else if(tipo.txt_nombreTipo === "Orden de Cambio"){
      this.is_changeOrder = true;
    }else if(tipo.txt_nombreTipo == "Orden de Trabajo"){
      this.is_workOrder = true;
    }else{
      this.is_modificatorio = true;
    }
  }

  onChange2(event) {
    if(event.checked){
      this.readonlydias = !this.readonlydias;
    }else{
      this.formGroup.get("dt_fechaNuevo").setValue("");
      this.readonlydias = !this.readonlydias;
    }
  }

  public uploadFinished = (event) => {
    this.response = event;
    this.formGroup.get('txt_archivoModificacion').setValue(this.response.dbPath.replace(/\\/g, "/"));
  }

  save() {
    if(this.is_complementario){
      if(this.formGroup.get('dt_fechaNuevo').value != "" && this.formGroup.get('vm_valorNuevo').value == ""){
        this.formGroup.get('dt_fechaNuevo').setValue(this.datePipe.transform(this.formGroup.get('dt_fechaNuevo').value, "yyyy-MM-dd"));
        this.formGroup.get('txt_detalleModificacion').setValue("Se modifico la fecha "+this.formGroup.get('dt_fechaActual').value +" por " +this.formGroup.get('dt_fechaNuevo').value);
      }
      else if(this.formGroup.get('dt_fechaNuevo').value == "" && this.formGroup.get('vm_valorNuevo').value != ""){
        this.formGroup.get('vm_valorActual').setValue(this.contrato.vm_montoAdjudicado);
        this.formGroup.get('txt_detalleModificacion').setValue("Se modifico el monto "+this.formGroup.get('vm_valorActual').value +" por " +this.formGroup.get('vm_valorNuevo').value);
      }
      else if(this.formGroup.get('dt_fechaNuevo').value != "" && this.formGroup.get('vm_valorNuevo').value != 0){
        this.formGroup.get('dt_fechaNuevo').setValue(this.datePipe.transform(this.formGroup.get('dt_fechaNuevo').value, "yyyy-MM-dd"));
        this.formGroup.get('vm_valorActual').setValue(this.contrato.vm_montoAdjudicado);
        this.formGroup.get('txt_detalleModificacion').setValue("Se modifico la fecha "+this.formGroup.get('dt_fechaActual').value +" por " +this.formGroup.get('dt_fechaNuevo').value +" y Se modifico el monto "+this.formGroup.get('vm_valorActual').value +" por " +this.formGroup.get('vm_valorNuevo').value);      
      }
    }
    if(this.is_modificatorio){
      this.formGroup.get('txt_detalleModificacion').setValue("Se modifico el contrato #"+this.contrato.txt_codigoContrato +" en una se sus clausulas detalladas en el nuevo contrato");
      
    }
    if(this.is_changeOrder){
      this.formGroup.get('txt_detalleModificacion').setValue("Se modifico el contrato #"+this.contrato.txt_codigoContrato +" con un monto estimado de $"+this.formGroup.get('vm_valorNuevo').value + " hasta su finalización");
      
    }
    if(this.is_workOrder){
      this.formGroup.get('txt_detalleModificacion').setValue("Se modifico el contrato #"+this.contrato.txt_codigoContrato +" con nuevo rubro de $"+this.formGroup.get('vm_valorNuevo').value);
      
    }
    this.dialogRef.close(this.formGroup.value);
  }

  close() {
    this.dialogRef.close();
  }

  resetForm() {
    this.formGroup.reset();
  }

}

export const MAX_RUBRO = 0.02;
export const MAX_COMPL = 0.08;
export const MAX_CAMB = 0.05;