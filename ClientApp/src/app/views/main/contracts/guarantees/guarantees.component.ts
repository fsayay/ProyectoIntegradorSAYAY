import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GuaranteesService } from './guarantees.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GuaranteesDialogComponent } from 'src/app/forms/guarantees-dialog/guarantees-dialog.component';
import { Garantia } from 'src/app/model.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RecordService } from '../../record/record.service';
import { ExpiratiosService } from '../expirations/expirations.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfLoaderComponent } from 'src/app/sharedService/pdf-loader/pdf-loader.component';
import { SecurityService } from 'src/app/services/security.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-guarantees',
  templateUrl: './guarantees.component.html'
})
export class GuaranteesComponent implements OnInit {
  
  displayedColumns: string[];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  dataSource: any;

  contratoActivo: any;
  formGroup: FormGroup;
  formHistorial: FormGroup;
  formVencimiento: FormGroup;
  userAuth: any;

  constructor(
    private formBuilder: FormBuilder,
    private garantiaService: GuaranteesService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private dialogForm: MatDialog,
    private modalService: NgbModal,
    private historialService: RecordService,
    private expirationService: ExpiratiosService,
    private securityService: SecurityService
    ){
      this.userAuth = this.securityService.GetAuthUser();
      if(this.userAuth.rol==="Administrador-Contrato"){
        this.displayedColumns = ['txt_codigoGarantia', 'tipoGarantia', 'txt_proveedorGarantia', 'vm_valorGarantia', 'dt_inicioGarantia', 'dt_finGarantia', 'txt_archivoGarantia', 'Modificar', 'Eliminar'];
      }else{
        this.displayedColumns = ['txt_codigoGarantia', 'tipoGarantia', 'txt_proveedorGarantia', 'vm_valorGarantia', 'dt_inicioGarantia', 'dt_finGarantia', 'txt_archivoGarantia'];
      }
      
    }

  ngOnInit() {
    this.userAuth = this.securityService.GetAuthUser();
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];      
    this.cargarDatos();
  }

  cargarDatos() {
    this.garantiaService.getGarantiasByContrato(this.contratoActivo.id).subscribe(data => {
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
  openFormDialog(data?: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    if(data){
      dialogConfig.data = data;
    }
    const dialogRef = this.dialogForm.open(GuaranteesDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.createForm(data)
        }        
      }
    );
  }

  createForm(data: any) {
    let garantia: Garantia;    
    if(data.ID === 0){      
      this.garantiaService.postGarantia(data).subscribe(garantiaDesdeWS => {
        this.crearHistorial("Se ingreso nueva garantia con codigo " + data.txt_codigoGarantia);
        this.crearVencimiento(garantiaDesdeWS);   
      }, error => this.showError(), () => this.showSuccess("¡Ingreso de datos exitoso!!"));
    }else{
      this.garantiaService.putGarantia(data).subscribe(garantiaDesdeWS => {
        this.crearHistorial("Se modifico la garantia con codigo " + data.txt_codigoGarantia); 
      }, error => this.showError(), () => this.showSuccess("¡Cambio de datos exitoso!!"));
    }
    
  }

  //Instancia para el historial
  crearHistorial(mensaje: string) {
    this.historialForm(mensaje);
    let historial = this.formHistorial.value;
    this.historialService.postHistorial(historial).subscribe((data: any) => {
     console.log(data); 
    });
  }

  historialForm(mensaje: string){
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formHistorial = this.formBuilder.group({
      ID: 0,
      txt_seccionHistorial: "Garantia",
      txt_accionHistorial: mensaje,
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id
    });
  }

  // Instancia para el vencimiento
  crearVencimiento(garantia: any) {
    this.vencimientoForm(garantia);
    let vencimiento = this.formVencimiento.value;
    this.expirationService.postVencimientoView(vencimiento).subscribe((data: any) => {
      console.log(data);
    });
  }

  public vencimientoForm(garantia: any) {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formVencimiento = this.formBuilder.group({
      ID: 0,
      txt_nombreSeccion: 'Garantia',
      txt_nombreTipo: garantia.tipoGarantia,
      dt_fechaVencimiento: garantia.dt_finGarantia,
      qn_diasAnticipacion: '30',
      qn_frecuenciaAnticipacion: '5',
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id,
      garantiaID: garantia.id
    });
  }

  deleteConfirm(rowId: string){
    if (confirm("Seguro que desea eliminar este registro?")) {
      this.garantiaService.deleteGarantia(rowId).subscribe(() => this.showSuccess('Elemento eliminado'));
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


