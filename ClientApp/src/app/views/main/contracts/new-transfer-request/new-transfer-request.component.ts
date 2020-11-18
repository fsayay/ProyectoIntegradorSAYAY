import { Component,ViewChild, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorIntl } from "@angular/material/paginator";
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { Contrato, Solicitud } from 'src/app/model.component';
import { ContractListService } from '../contract-list/contract-list.service';
import { TransfersDialogComponent } from 'src/app/forms/transfers-dialog/transfers-dialog.component';
import { TransferRequestService } from '../transfer-request/transfer-request.service';
import { Router } from '@angular/router';
import { TransferResponseDialogComponent } from 'src/app/forms/transfer-response-dialog/transfer-response-dialog.component';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { SecurityService } from 'src/app/services/security.service';
import { DatePipe } from '@angular/common';

/**
 * @title Table with selection
 */
@Component({
  selector: 'app-new-transfer-request',
  templateUrl: './new-transfer-request.component.html',
  styleUrls: ['./new-transfer-request.component.css']
})
export class NewTransferRequestComponent implements OnInit {

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  
  //variables
  isContractAdmin: boolean = false;
  userAuth: any;
  solicitud: any;
  isDisabled: boolean;
  idContratos: any[];
  formGroup: FormGroup;
 
  contratos: Contrato[];
    
  displayedColumns = ['select', 'txt_codigoContrato', 'txt_objetoContratacion', 'txt_nombreProveedor'];
  dataSource: any;
  
  selection = new SelectionModel<Contrato>(true, []);

  constructor(
    private contratosService: ContractListService,
    private toastr: ToastrService,    
    private dialogForm: MatDialog,
    private datePipe: DatePipe,
    private router: Router,
    private formBuilder: FormBuilder,
    private securityService: SecurityService,
    private solicitudService: TransferRequestService,
    private paginator: MatPaginatorIntl) {
    this.paginator.itemsPerPageLabel = "Registros por página";
    this.paginator.nextPageLabel = "Siguiente";
    this.paginator.previousPageLabel = "Anterior";
    this.paginator.lastPageLabel = "Ultima Página";
    this.paginator.firstPageLabel = "Primera Página";
  }  

  ngOnInit() {  
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];  
    this.formGroup = this.formBuilder.group({
      contratos: this.formBuilder.array([])
    });
    this.userAuth = this.securityService.GetAuthUser();    
    this.cargarDatos();     
  }
  
  cargarDatos(){    
    if(this.userAuth.rol === 'Administrador-Contrato'){
      this.contratosService.getContratosByAdmin(this.userAuth.id).subscribe(data => {
        data = data.filter(x => (x.qn_estadoTransferencia===26) || (x.qn_estadoTransferencia===0) );  
        if(data!=''){
          
          this.dataSource.data = data;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }
        else{
          this.redirect();
        }
        
      });
    }else if(this.userAuth.rol === 'Usuario-UAS'){
      this.solicitud = this.solicitudService.getSolicitud();
      this.contratosService.getContratosByAdmin(this.solicitud.qn_idEmisor).subscribe(data => {
        data = data.filter(x => (x.qn_estadoTransferencia===24) && (x.solicitudID === this.solicitud.id) );
        if(data!=''){
          this.dataSource.data = data;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }
        else{
          this.updateTransferRequest();
        }
      });
    }    
  }  

  updateTransferRequest(){
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.solicitud.qn_estadoSolicitud = 32;
    this.solicitud.dt_fechaUltimoCambio =today;
    let solici;
    this.solicitudService.putSolicitud(this.solicitud).subscribe(item => solici = item, error => console.error(error),() => this.redirect());
  }

  redirect(){
    this.router.navigate(["/Solicitudes" ]);
  }

  isAllSelected() {    
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  
  masterToggle() {
    this.isAllSelected() ?
      this.unChecked() :
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
        const contratoFormArray = <FormArray>this.formGroup.controls.contratos;    
        contratoFormArray.push(new FormControl(row));
      });
    
  }

  unChecked(){
    this.selection.clear();
    if(this.formGroup.get('contratos').value!=null){
      const contratoFormArray = <FormArray>this.formGroup.controls.contratos;
      contratoFormArray.value.forEach(row => {
        let index = contratoFormArray.controls.findIndex(x => x.value == row)
      contratoFormArray.removeAt(index);
      });
    }
  }

  /** The label for the checkbox on the passed row */
  
  checkboxLabel(row?: Contrato): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ID}`;
  }

  onChange(contrato: any, event) {
    const contratoFormArray = <FormArray>this.formGroup.controls.contratos;

    if (event.checked) {
      contratoFormArray.push(new FormControl(contrato));
    } else {
      let index = contratoFormArray.controls.findIndex(x => x.value == contrato)
      contratoFormArray.removeAt(index);
    }
  }

  //Metodo dialog form
  openFormDialog(){
    if(this.selection.selected.length>0){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.data = this.selection.selected.length;
      dialogConfig.width = '500px';

      const dialogRef = this.dialogForm.open(TransfersDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
        data => {
          if(data){
            this.createForm(data)
          }        
        }
      );
    }else{
      alert("Tiene que elegir por lo menos un contrato!!");    
    }
    
  }

  createForm(data: any) {
    let solicitud: Solicitud;
    this.solicitudService.postSolicitud(data).subscribe(item => {
      if(this.formGroup.get('contratos').value!=null){
        const contratoFormArray = <FormArray>this.formGroup.controls.contratos;
        contratoFormArray.value.forEach(row => {
          row.qn_estadoTransferencia = 24;
          row.solicitudID = item.id;
          row.dt_fechaUltimoCambio = data.dt_fechaUltimoCambio                   
        });
      }
      this.solicitudService.putContratos(this.formGroup.get('contratos').value).subscribe( item => {
        console.log('ok');
      }        
      );
    },error => this.showError(), () => this.showSuccess("¡¡ Ingreso de Datos Exitoso !!"));
    
  }

  transferResponse(){
    if(this.selection.selected.length>0){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.data = this.selection.selected.length;
      dialogConfig.width = '500px';

      const dialogRef = this.dialogForm.open(TransferResponseDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
        data => {
          if(data===undefined){
            this.unChecked();
          }          
          if(data){
            this.transfering(data)
          }        
        }
      );
    }else{
      alert("Tiene que elegir por lo menos un contrato!!");    
    }
    
  }

  transfering(data: any) {
    if(this.formGroup.get('contratos').value!=null){
      const contratoFormArray = <FormArray>this.formGroup.controls.contratos;
      contratoFormArray.value.forEach(row => {
        row.qn_estadoTransferencia = 25;
        row.userID = data.userID;
        row.dt_fechaUltimoCambio = data.dt_fechaUltimoCambio                   
      });
    }     
    this.solicitudService.putContratos(this.formGroup.get('contratos').value).subscribe( () => this.successAction());    
  }

  deniedAction(item){
    if(this.selection.selected.length > 0) 
    {
      if(this.formGroup.get('contratos').value!=null){
        const contratoFormArray = <FormArray>this.formGroup.controls.contratos;
        contratoFormArray.value.forEach(row => {
          row.qn_estadoTransferencia = 26;                   
        });
      }     
      this.solicitudService.putContratos(this.formGroup.get('contratos').value).subscribe( () => this.successAction());

    }else 
    {
      alert("Tiene que elegir por lo menos un contrato!!");
    }
  }

  successAction(){
    this.unChecked();
    this.toastr.success('', 'Success!');
    this.cargarDatos();
  }

  // Metodo para decirle al usuario que todo salio correcto
  showSuccess(mensaje: string) {
    this.toastr.success(mensaje, 'Success!');
    this.router.navigate(["/Solicitudes" ]);
  }

  showError() {
    this.toastr.error('A ocurrido un error en el servidor!', 'Error!');
  }
}


