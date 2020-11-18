import { Component, OnInit, Inject } from '@angular/core';
import { CatalogService } from 'src/app/views/setting/catalog/catalog.service';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/views/main/contracts/reports/reports.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-informe-multa',
  templateUrl: './informe-multa.component.html',
  styleUrls: ['./informe-multa.component.css']
})
export class InformeMultaComponent implements OnInit {

  informeMultas: any;
  contratoActivo: any;

  constructor(
    private catalogoService: CatalogService,
    private http: Router,    
    private dialogRef: MatDialogRef<InformeMultaComponent>, @Inject(MAT_DIALOG_DATA) data,
    private informeService: ReportsService
  ) { }

  ngOnInit(): void {
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.informeService.getInformesByContrato(this.contratoActivo.id).subscribe(data => {
      this.informeMultas = data.filter( (item) => item.tipoInforme === "Multa");
    }, error => console.log("Error: " + error));
  }

  private submitForm(txt_codigoInforme: string) {
    this.dialogRef.close(txt_codigoInforme);
  }

}
