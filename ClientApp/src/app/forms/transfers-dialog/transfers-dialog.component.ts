import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { InformeMultaComponent } from '../informe-multa/informe-multa.component';
import { CatalogService } from 'src/app/views/setting/catalog/catalog.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { UsersDialogComponent } from '../users-dialog/users-dialog.component';
import { SecurityService } from 'src/app/services/security.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transfers-dialog',
  templateUrl: './transfers-dialog.component.html',
  styleUrls: ['./transfers-dialog.component.css']
})
export class TransfersDialogComponent implements OnInit {

  formGroup: FormGroup;
  usuario: any;
  title: string;
  
  constructor(
    private dialogRef: MatDialogRef<TransfersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dialogForm: MatDialog,
    private securityService: SecurityService
  ) { 
    
  }

  ngOnInit(): void {
    this.title = "Transferencia de Contratos";
    this.usuario = this.securityService.GetAuthUser();
    this.createForm();
    
  }

  
  private createForm() {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    const codTransfer = new Date().getTime();
    this.formGroup = this.formBuilder.group({
      ID: 0,
      txt_codigoSolicitud: codTransfer,
      qn_cantContratos: this.data,
      txt_motivoSolicitud: ['', Validators.required],
      txt_admRecomendado: ['', Validators.required],
      qn_idReceptor: ['', Validators.required],
      nombreReceptor: '',
      qn_idEmisor: this.usuario.id,
      qn_estadoSolicitud: 24,
      dt_fechaUltimoCambio: today,
    });
  }

  selectedOption(option: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = option;
    dialogConfig.width = '500px';

    const dialogRef = this.dialogForm.open(UsersDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      elected => {
        if(elected){
          if(option===1){
            this.formGroup.get('txt_admRecomendado').setValue(elected.txt_nombre +' '+ elected.txt_apellido);
          }else{
            this.formGroup.get('qn_idReceptor').setValue(elected.id);
            this.formGroup.get('nombreReceptor').setValue(elected.nombre +' '+ elected.apellido);
          }
          
        }        
      }
    );
  }
  onSubmit(){
    this.dialogRef.close(this.formGroup.value);
  }

}
