import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ExpiratiosService } from './expirations.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ExpirationsDialogComponent } from 'src/app/forms/expirations-dialog/expirations-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { VencimientoModel } from 'src/app/model.component';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-expirations',
  templateUrl: './expirations.component.html'
})
export class ExpirationsComponent implements OnInit {
  
  displayedColumns: string[] = [
                                'Seccion',
                                'Tipo',
                                'Fecha',
                                'Anticipacion',
                                'Frecuencia'
                              ];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  dataSource: any;
  contratoActivo: any;
  userAuth: any;
  vencimientos= new Array;

  constructor(
    private vencimientoService: ExpiratiosService,
    private toastr: ToastrService,
    private dialogForm: MatDialog,
    private router: Router,
    private securityService: SecurityService
    ) {
  }

  ngOnInit() {
    this.userAuth = this.securityService.GetAuthUser();
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
      
    this.cargarDatos();    
  }

  //Metodo para filtrar
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); 
    filterValue = filterValue.toLowerCase(); 
    this.dataSource.filter = filterValue;
  }

  cargarDatos(){
    this.vencimientos = [];
    this.vencimientoService.getVencimientoViewByContrato(this.contratoActivo.id).subscribe(data => {
      data.forEach(element => {
        let vencimiento: VencimientoModel;
        if(element.txt_nombreSeccion=='Garantia'){
          vencimiento = {
            Seccion: element.txt_nombreSeccion,
            Tipo: element.tipoGarantia,
            Fecha: element.fechaFinGarantia,
            Anticipacion: element.qn_diasAnticipacion,
            Frecuencia: element.qn_frecuenciaAnticipacion
          }
          data = data.filter( x => x.id!=element.id);
          this.vencimientos.push(vencimiento);
        }

        if(element.txt_nombreSeccion=='Pago'){
          vencimiento = {
            Seccion: element.txt_nombreSeccion,
            Tipo: element.tipoPago,
            Fecha: element.fechaTentativaPago,
            Anticipacion: element.qn_diasAnticipacion,
            Frecuencia: element.qn_frecuenciaAnticipacion
          }
          data = data.filter( x => x.id!=element.id);
          this.vencimientos.push(vencimiento);
        }

        if(element.txt_nombreSeccion=='Entregable'){
          vencimiento = {
            Seccion: element.txt_nombreSeccion,
            Tipo: element.tipoEntregable,
            Fecha: element.fechaEntregable,
            Anticipacion: element.qn_diasAnticipacion,
            Frecuencia: element.qn_frecuenciaAnticipacion
          }
          data = data.filter( x => x.id!=element.id);
          this.vencimientos.push(vencimiento);
        }
        
        if(element.txt_nombreSeccion=='Contrato'){
          vencimiento = {
            Seccion: element.txt_nombreSeccion,
            Tipo: element.tipoContrato,
            Fecha: element.fechaFinContrato,
            Anticipacion: element.qn_diasAnticipacion,
            Frecuencia: element.qn_frecuenciaAnticipacion
          }
          data = data.filter( x => x.id!=element.id);
          this.vencimientos.push(vencimiento);
        }
      });
      this.dataSource.data = this.vencimientos;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, error => console.log("Error: " + error));
  }

  openFormDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialogForm.open(ExpirationsDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.createForm(data)
        }        
      }
    );
  }

  createForm(data: any) {
    const vencimientos =  new Array();
    if(data.vencimientoPagos !== null ){
      data.vencimientoPagos.forEach( pagos => {
        if( (pagos.qn_diasAnticipacion !== "") && (pagos.qn_frecuenciaAnticipacion !== "")){
          vencimientos.push(pagos);    
        }
      });
    }
    if(data.vencimientoEntregables !== null ){
      data.vencimientoEntregables.forEach(entregables => {
        if((entregables.qn_diasAnticipacion !== "")&&(entregables.qn_frecuenciaAnticipacion!=="")){
          vencimientos.push(entregables);
        }
      });
    }
    if(vencimientos.length>0){
      let vencimiento;
      this.vencimientoService.postVencimiento(vencimientos).subscribe(item => vencimiento = item, error => this.showError(), () => this.showSuccess("¡Ingreso de dato exitoso!!"));
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

  calendarView(){
    this.router.navigate([`/Contrato/${this.contratoActivo.id}/Vencimientos/Calendario`]);
  }

}
