import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PdfLoaderComponent } from 'src/app/sharedService/pdf-loader/pdf-loader.component';
import { RecordService } from '../../record/record.service';
import { ContractListService } from '../contract-list/contract-list.service';

@Component({
  selector: 'app-general-data',
  templateUrl: './general-data.component.html'
})
export class GeneralDataComponent implements OnInit {
  panelOpenState = false;
  step = 0;
  now = new Date();

  closeButtom: boolean;

  contrato: any;
  formHistorial: FormGroup;
  nombreArchivo: string;

  constructor( 
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private historialService: RecordService,
    private formBuilder: FormBuilder,
    private contratoService: ContractListService
  ) { 
    
  }

  ngOnInit() {
    this.cargarData();
  }

  cargarData(){
    let id = JSON.parse(localStorage.getItem('idContratoActivo'));
    this.contratoService.getContratoDetalle(id).subscribe( item => {
      this.contrato = item;
      console.log(this.contrato);
      if(this.contrato.qn_estadoContrato == 20)
        this.compareDate(item);
      localStorage.setItem('contratoActivo', JSON.stringify(item));
      //this.unidad = this.unidades.find(unidad => unidad.id == this.contrato.qn_unidadConsolidadora); 
      this.nombreArchivo = this.getFilePath(this.contrato.txt_archivoContrato);
    });
  }

  closeContract(contrato: any)
  {
    contrato.qn_estadoContrato = 21
    this.contratoService.putContrato(contrato).subscribe( item => {
      this.crearHistorial("Finaliza plazo del contrato  " );
    }, error => this.showError(), () => this.showSuccess('¡ Contrato Terminado !')
    );    
  }

  crearHistorial(mensaje: string) {
    this.historialForm(mensaje);
    let historial = this.formHistorial.value;
    this.historialService.postHistorial(historial).subscribe((data: any) => historial = data);
  }

  historialForm(mensaje: string){
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formHistorial = this.formBuilder.group({
      ID: 0,
      txt_seccionHistorial: "Entregable",
      txt_accionHistorial: mensaje,
      dt_fechaUltimoCambio: today,
      contratoID: this.contrato.id
    });
  }

  // Metodo para decirle al usuario que todo salio correcto
  showSuccess(mensaje: string) {
    this.toastr.success(mensaje, 'Success!');
    this.cargarData();
  }

  showError() {
    this.toastr.error('A ocurrido un error en el servidor!', 'Error!');
  }

  compareDate(data: any)
  {
    this.closeButtom = false;
    var now = new Date();
    var fechaHoy= new Date(this.datePipe.transform(now, "yyyy-MM-dd"));
    var fechaFin = new Date(this.datePipe.transform(data.fechaFinReal, "yyyy-MM-dd"));
        let d1 = fechaHoy.getTime();
        let d2 = fechaFin.getTime();
        if (d1 > d2 ) {
          this.closeButtom = !this.closeButtom;
        }
        
  }

  verPdf(url: any) {
    const modalRef = this.modalService.open(PdfLoaderComponent, { size: 'xl' });
    modalRef.componentInstance.filePath = url;
  }

  getFilePath(filePath: string) {
    const tempFileName = filePath.split('/');
    const nameFile = tempFileName[tempFileName.length - 1];
    return nameFile;
  }

}
