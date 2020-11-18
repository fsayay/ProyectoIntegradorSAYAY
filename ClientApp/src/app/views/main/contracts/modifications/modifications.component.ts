import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ModificationsService } from './modifications.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ModificationsDialogComponent } from 'src/app/forms/modifications-dialog/modifications-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RecordService } from '../../record/record.service';
import { ContractListService } from '../contract-list/contract-list.service';
import { SecurityService } from 'src/app/services/security.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modifications',
  templateUrl: './modifications.component.html'
})
export class ModificationsComponent implements OnInit {
  displayedColumns: string[] = ['tipoModificacion', 'txt_detalleModificacion', 'txt_motivoModificacion', 'dt_fechaUltimoCambio' ];

  columnas = [
    { title: "Tipo", name: "tipoModificacion" },
    { title: "Detalle", name: "txt_detalleModificacion" },
    { title: "Motívo", name: "txt_motivoModificacion" },
    { title: "Fecha de Modificación", name: "dt_fechaUltimoCambio" }
  ];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  dataSource: any;
  contratoActivo: any;
  formHistorial: FormGroup;
  userAuth: any;
  contrato: any;

  constructor(
    private modificacionService: ModificationsService,
    private dialogForm: MatDialog,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private historialService: RecordService,
    private toastr: ToastrService,
    private contratosService: ContractListService,
    private securityService: SecurityService
    ) {
  }

  ngOnInit() {
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.userAuth = this.securityService.GetAuthUser();
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];    
    this.cargarDatos();
  }

  cargarDatos(){
    this.contratosService.getContratoDetalle(this.contratoActivo.id).subscribe( item =>{
      this.contrato = item;
    })
    this.modificacionService.getModificacionesByContrato(this.contratoActivo.id).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, error => console.log("Error: " + error));
  }

  //Metodo para filtrar
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  
  //Metodo dialog form
  openFormDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialogForm.open(ModificationsDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.createForm(data)
        }        
      }
    );
  }

  createForm(data: any) {
    let modificacion = data ;
    this.crearHistorial("Se hizo modificaciones en el contrato");
    if(data.dt_fechaNuevo!==""){
      this.contrato.qn_diasProrroga = parseInt(this.contrato.qn_diasProrroga) + parseInt(data.diasProrroga);
    }
    if(data.vm_valorNuevo !==""){
      this.contrato.vm_montoAdicional = data.vm_valorNuevo - data.vm_valorActual;
    }
    this.contratosService.putContrato(this.contrato).subscribe( () => {      
      this.modificacionService.postModificacion(modificacion).subscribe(modificacionDesdeWS => modificacion = modificacionDesdeWS, error => this.showError(), () => this.showSuccess("¡Ingreso de dato exitoso!!"));
    }, error => this.showError(), () => this.showSuccess("¡Ingreso de dato exitoso!!"));
    
  }

  //Instancia para el historial
  crearHistorial(mensaje: string) {
    this.historialForm(mensaje);
    let historial = this.formHistorial.value;
    console.log(historial);
    this.historialService.postHistorial(historial).subscribe((data: any) => historial = data);
  }

  historialForm(mensaje: string){
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formHistorial = this.formBuilder.group({
      ID: 0,
      txt_seccionHistorial: "Modificación",
      txt_accionHistorial: mensaje,
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id
    });
  }

  // Metodo para decirle al usuario que todo salio correcto
  showSuccess(mensaje: string) {
    this.toastr.success(mensaje, 'Success!');
    this.cargarDatos();
  }

  showError() {
    this.toastr.error('A ocurrido un error en el servidor!', 'Error!');
  }
}

