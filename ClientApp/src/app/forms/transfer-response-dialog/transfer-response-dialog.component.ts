import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CatalogService } from 'src/app/views/setting/catalog/catalog.service';
import { Observable } from 'rxjs';
import { SecurityService } from 'src/app/services/security.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transfer-response-dialog',
  templateUrl: './transfer-response-dialog.component.html',
  styleUrls: ['./transfer-response-dialog.component.css']
})
export class TransferResponseDialogComponent implements OnInit {

  formGroup: FormGroup;
  userAuth: any;
  title: string;
  administradores = new Array();

  keyword = 'administrador';

  formControl = new FormControl();
  filteredOptions: Observable<string[]>;
  
  constructor(
    private dialogRef: MatDialogRef<TransferResponseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private catalogoService: CatalogService,
    private securityService: SecurityService  
  ) { 
  }

  ngOnInit(): void {
    this.title = "Transferencia de Contratos";
    this.userAuth = this.securityService.GetAuthUser();
    this.catalogoService.getAdmins().subscribe( items => {
      items = items.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
      this.administradores = items;
    });
    this.createForm();
    
  }

  selectEvent(item) {
    this.formGroup.get('userID').setValue(item.id);
  }
 
  private createForm() {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formGroup = this.formBuilder.group({
      qn_estadoTransferencia: 25,
      userID: ['', Validators.required],
      dt_fechaUltimoCambio: today,
    });
  }

  
  onSubmit(){
    this.dialogRef.close(this.formGroup.value);
  }

}
