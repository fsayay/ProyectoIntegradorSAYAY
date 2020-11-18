import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PaymentsService } from './payments.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PaymentsDialogComponent } from 'src/app/forms/payments-dialog/payments-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RecordService } from '../../record/record.service';
import { CurDialogComponent } from 'src/app/forms/cur-dialog/cur-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfLoaderComponent } from 'src/app/sharedService/pdf-loader/pdf-loader.component';
import { UpdatePayComponent } from 'src/app/forms/update-pay/update-pay.component';
import { FormaPago, Pago } from 'src/app/model.component';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html'
})
export class PaymentsComponent implements OnInit {
  
  displayedColumns: string[];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  dataSource: any;
  contratoActivo: any;
  userAuth: any;
  formHistorial: FormGroup;
  public sumaTotal: number;
  public _faltaPorcentaje: boolean;

  constructor(
    private pagoService: PaymentsService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private historialService: RecordService,
    private modalService: NgbModal,
    private dialogForm: MatDialog,
    private datePipe: DatePipe,
    private securityService: SecurityService
    ) {
      this.userAuth = this.securityService.GetAuthUser();
      if(this.userAuth.rol==="Administrador-Contrato"){
        this.displayedColumns = ['qn_porcentajePago', 'vm_montoPago', 'dt_tentativaPago', 'txt_comprobantePago', 'dt_realPago', 'txt_archivoPago', 'Modificar', 'Eliminar'];
      }else{
        this.displayedColumns = ['qn_porcentajePago', 'vm_montoPago', 'dt_tentativaPago', 'txt_comprobantePago', 'dt_realPago', 'txt_archivoPago'];
      }
  }

  ngOnInit() {
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.userAuth = this.securityService.GetAuthUser();
    this.dataSource = new MatTableDataSource();
    this.cargarDatos();   
  }

  cargarDatos(){
    this._faltaPorcentaje = false;    
    this.dataSource.data = [];
    this.pagoService.getFormaPagoByContrato(this.contratoActivo.id).subscribe(data => {
      if(data.length>0){
        this.sumarPorcentaje(data);
        this.dataSource.data = data;      
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }      
    }, error => console.log("Error: " + error));
  }

  //Metodo para filtrar
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  sumarPorcentaje(data?: any){
    this.sumaTotal = 0;
    data.forEach(x => {
      this.sumaTotal = this.sumaTotal + x.qn_porcentajePago;
    });
    if (this.sumaTotal>0 && this.sumaTotal<100){
      this._faltaPorcentaje = true;
    }
  }

  upLoadCUR(row){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    const dialogRef = this.dialogForm.open(CurDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          row.ID = row.id;
          row.dt_realPago = data.dt_realPago;
          row.txt_comprobantePago = data.txt_comprobantePago;
          row.txt_archivoPago = data.txt_archivoPago;
          row.dt_fechaUltimoCambio = data.dt_fechaUltimoCambio;
          this.updateCur(row)
        }        
      }
    );
  }

  updateCur(data: any){
    let curPago;
    this.crearHistorial("Se ingreso datos del CUR #" + data.txt_comprobantePago);   
    this.pagoService.putCurPago(data).subscribe(item => curPago = item, error => this.showError(), () => this.showSuccess("¡¡ Ingreso de Datos Exitoso !!"));    
  }

  //Metodo dialog form
  openFormDialog(data?: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';    
    var dialogRef;
    if(data){
      dialogConfig.data = {
        'data': data,
        'dataSource': this.dataSource
      }
      dialogRef = this.dialogForm.open(UpdatePayComponent, dialogConfig);
    }else{
      dialogRef = this.dialogForm.open(PaymentsDialogComponent, dialogConfig);
    }    
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.createForm(data)
        }        
      }
    );
  }

  createForm(data: any) {
    if(data.ID !== 0){
      if (isNaN(data.vm_montoPago)) {
        data.vm_montoPago = data.vm_montoPago.replace('$','');
      }      
      let formaPago: FormaPago;
      formaPago = {
        ID: data.formaPagoID,
        id: data.formaPagoID,
        qn_tipoPago: data.qn_tipoPago,
        dt_fechaUltimoCambio: data.dt_fechaUltimoCambio,
        pagos: [{
          id: data.pagoID,
          ID: data.pagoID,
          qn_porcentajePago: data.qn_porcentajePago,
          bol_esAnticipo: data.bol_esAnticipo,
          vm_montoPago: data.vm_montoPago,
          dt_tentativaPago: data.dt_tentativaPago,
          dt_realPago: data.dt_realPago,
          txt_comprobantePago: data.txt_comprobantePago,
          txt_archivoPago: data.txt_archivoPago,
          dt_fechaUltimoCambio: data.dt_fechaUltimoCambioPago,
          formaPagoID: data.formaPagoID
        }],
        contratoID: data.contratoID
      }
      let pago: Pago;
      pago = formaPago.pagos[0];
      if(pago.id==0){
        this.pagoService.postPago(pago).subscribe(item => {
          this.pagoService.putFormaPago(formaPago).subscribe( item => {
            console.log(item);
          })
        }, error => this.showError(), () => this.showSuccess("¡¡ Cambio de Datos Exitoso !!"));
      }else{
        this.pagoService.putPago(pago).subscribe(item => {
          this.pagoService.putFormaPago(formaPago).subscribe( item => {
            console.log(item);
          })
        }, error => this.showError(), () => this.showSuccess("¡¡ Cambio de Datos Exitoso !!"));
      }      
    }else{
      let formaPago = data;
      for (let pago in formaPago.pagos) {
        formaPago.pagos[pago].dt_tentativaPago = this.datePipe.transform(formaPago.pagos[pago].dt_tentativaPago, "yyyy-MM-dd");
        if( formaPago.qn_tipoPago == "8" || formaPago.qn_tipoPago == "29"){
          formaPago.pagos[pago].vm_montoPago = formaPago.pagos[pago].vm_montoPago.replace('$','');
        }        
      }
      this.crearHistorial("Se ingreso nueva forma de pago para este contrato "); 

      this.pagoService.postFormaPago(formaPago).subscribe(item => formaPago = item, error => this.showError(), () => this.showSuccess("¡¡ Ingreso de Datos Exitoso !!"));
    }    
  }

  //Instancia para el historial
  crearHistorial(mensaje: string) {
    this.historialForm(mensaje);
    let historial = this.formHistorial.value;
    this.historialService.postHistorial(historial).subscribe((data: any) => historial = data);
  }

  historialForm(mensaje: string){
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formHistorial = this.formBuilder.group({
      ID: 0,
      txt_seccionHistorial: "Forma de Pago",
      txt_accionHistorial: mensaje,
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id
    });
  }

  deleteConfirm(row: any){

    if (confirm("Seguro que desea eliminar este registro?")) {
      let porcentaje = this.sumaTotal - row.qn_porcentajePago;
      if(porcentaje === 0)
      {
        this.pagoService.deleteFormaPago(row.formaPagoID).subscribe(result => {
          console.log(result);
        });
      }
      this.pagoService.deletePago(row.id).subscribe(() => this.showSuccess('Elemento eliminado'));
    }
  }

  // Metodo para decirle al usuario que todo salio correcto
  showSuccess(mensaje: string) {
    this.toastr.success(mensaje, 'Success!');
    this.cargarDatos();
  }

  showError() {
    this.toastr.error('A ocurrido un error en el servidor!', 'Error!');
  }

  verPdf(url: any) {
    const modalRef = this.modalService.open(PdfLoaderComponent, { size: 'xl' });
    modalRef.componentInstance.filePath = url;
  }
}
