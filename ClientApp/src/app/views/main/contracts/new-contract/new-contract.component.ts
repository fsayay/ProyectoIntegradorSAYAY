import { Component, OnInit } from '@angular/core';
import { Contrato, Tipo } from 'src/app/model.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CatalogService } from 'src/app/views/setting/catalog/catalog.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ContractListService } from '../contract-list/contract-list.service';
import { RecordService } from '../../record/record.service';
import { ExpiratiosService } from '../expirations/expirations.service';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { SecurityService } from 'src/app/services/security.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProveedorService } from 'src/app/views/setting/proveedor/proveedor.service';
import { UnidadService } from 'src/app/views/setting/unidad/unidad.service';

@Component({
  selector: 'app-new-contract',
  templateUrl: './new-contract.component.html',
  styleUrls: ['./new-contract.component.css']
})
export class NewContractComponent implements OnInit {

  // Autocomplete with mat-autocomplete
  proveedorCtrl: FormControl = new FormControl();
  filteredProveedor: Observable<any[]>;
  statesProveedor: String[];
  proveedores: any[];

  public contrato: Contrato;
  contratoActivo: any;
  public userAuth: any;
  formGroup: FormGroup;
  formGroupReset: FormGroup;
  formHistorial: FormGroup;
  formVencimiento: FormGroup;
  public readonly: boolean;
  
  public tiposContrato: Tipo[];
  public tiposProceso: Tipo[];


  public progress: number;
  public message: string;
  public tipoContrato: string;
  public unidades = [];
  public tempFile: FileList;
  public value;
  public response: {dbPath: ''};
  constructor(
    private formBuilder: FormBuilder,
    private catalogoService: CatalogService,
    private unidadService: UnidadService,
    private toastr: ToastrService,
    private router: Router,
    private datePipe: DatePipe,
    private proveedorService: ProveedorService,
    private titlecasePipe: TitleCasePipe,
    private historialService: RecordService,
    private expirationService: ExpiratiosService,
    private contratosService: ContractListService,
    private securityService: SecurityService
    ) { 

      this.catalogoService.getItem(1).subscribe( item => {
        this.tiposContrato = item.tipos;
        this.catalogoService.getItem(9).subscribe( item => {
          this.tiposProceso = item.tipos;
        })
      }, err => console.error(err));

      this.unidadService.getUnidad().subscribe( items => {        
        this.unidades = items;
      });
      
    }

    

  ngOnInit() {
    this.readonly = true;
    this.userAuth = this.securityService.GetAuthUser();
    this.contratoActivo =  JSON.parse(localStorage.getItem('contratoActivo'));
    this.createForm();
    if(this.contratoActivo!==null && (this.contratoActivo.qn_tipoContrato === 0 || this.contratoActivo.qn_tipoProceso === 0)){
      this.contratoActivo.dt_fechaInicio = this.datePipe.transform(this.contratoActivo.dt_fechaInicio, 'yyyy-MM-dd');
      this.contratoActivo.dt_fechaFin = this.datePipe.transform(this.contratoActivo.dt_fechaFin, 'yyyy-MM-dd');
      this.contratoActivo.dt_fechaSuscripcion = this.datePipe.transform(this.contratoActivo.dt_fechaSuscripcion, 'yyyy-MM-dd');
      this.formGroup.patchValue(this.contratoActivo);
      for (let i in this.contratoActivo) {
        console.log(this.formGroup.get(i).value);
        if(this.formGroup.get(i).value !== 0 && this.formGroup.get(i).value !== null){
          this.formGroup.get(i).disable();
          if(i === 'vm_montoAdjudicado'){
            this.value = this.contratoActivo.vm_montoAdjudicado;
          }         
        }         
      }
    }    
    this.formGroup.get('administrador').setValue(this.titlecasePipe.transform(this.userAuth.nombres +' '+this.userAuth.apellidos));
  }

  private createForm() {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formGroup = this.formBuilder.group({
      ID: 0,
      id: 0,
      txt_codigoContrato: ['', Validators.required],
      qn_tipoContrato: ['', Validators.required],
      txt_numProceso: ['', Validators.required],
      qn_tipoProceso: ['', Validators.required],
      qn_vigenciaContrato: ['', Validators.required],
      dt_fechaSuscripcion: ['', Validators.required],
      dt_fechaInicio: ['', Validators.required],
      dt_fechaFin: ['', Validators.required],
      vm_montoAdjudicado: ['', Validators.required],
      bol_recurrencia: [false],
      txt_nombreProveedor: ['', Validators.required],
      txt_rucProveedor: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      txt_objetoContratacion: ['', Validators.required],
      qn_unidadConsolidadora: ['', Validators.required],
      txt_nombreDelegado: ['', Validators.required],
      userID: [this.userAuth.id],
      txt_nombreTecnicoExterno: '',
      txt_detalleFormaPago: [''],
      txt_detalleGarantias: [''],
      txt_archivoContrato: ['', Validators.required],     
      qn_estadoContrato: 20,
      qn_estadoTransferencia: 0,
      dt_fechaUltimoCambio: today,
      qn_diasProrroga: 0,
      fechaFinReal: today,
      montoActual: 0,
      vm_montoAdicional: 0,  
      solicitudID: 0,
      estadoTransferencia: '',      
      estadoContrato: '',
      tipoContrato: '',
      tipoProceso: '',
      administrador: ''
      
    });
  }

  elegirTipoContrato(selectedValue: any) {
    let val = parseInt(selectedValue, 10);
    this.tiposContrato.forEach( x => {
      if(x.tipoID===val){
        this.tipoContrato = x.txt_nombreTipo;
      }
    });
  }

  getProveedor() {
    this.statesProveedor = new Array();
    this.proveedorService.getProveedor()
      .subscribe(data => {
        const newArr = []
        const myObj = {}        
        data.forEach(x => !(x.id in myObj) && (myObj[x.id] = true) && newArr.push(x));
        this.proveedores = newArr;
        newArr.forEach(x => {
          this.statesProveedor.push(x.txt_nombreProveedor);
        });        
        this.filteredProveedor = this.proveedorCtrl.valueChanges
          .pipe(
          startWith(''),
          map(state => state ? this.filterStatesProveedor(state) : this.statesProveedor.slice())
          )
      })
  }

  selectedProveedor(value: string){    
    this.proveedores.forEach( x => {
      if(x.txt_nombreProveedor == value)
      {
        this.formGroup.get('txt_nombreProveedor').setValue(x.txt_nombreProveedor);
        this.formGroup.get('txt_rucProveedor').setValue(x.txt_rucProveedor);
      }      
    })
  }

  filterStatesProveedor(name: string) {
    return this.statesProveedor.filter(state =>
      state.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  updateValueProveedor(value: string) {
    this.formGroup.get('txt_nombreProveedor').setValue(value);
  }

  verificarPlazo(){
    if(this.formGroup.get('qn_vigenciaContrato').value !="")
    {
      this.readonly = false;
    }else
    {
      alert('Ingrese el plazo del contrato');
    }
  }

  updateValue(value: string) {

    if(this.formGroup.get('qn_vigenciaContrato').value !="")
    {
      
      let dias = this.formGroup.get('qn_vigenciaContrato').value;
      let diasEnMilisegundos = 1000 * 60 * 60 * 24 * dias;  

      let fechaInicio = new Date(value);

      let fechaFin =  fechaInicio.getTime() + diasEnMilisegundos;
      this.formGroup.get('dt_fechaFin').setValue(this.datePipe.transform(new Date(fechaFin), "yyyy-MM-dd"));
    }
    else{
      alert("¡No ha ingresado el plazo del contrato!");
      this.formGroup.get('dt_fechaFin').setValue("");
    }    
  }

  

  onSubmit() {
    if(this.contratoActivo !== null){      
      for (let i in this.contratoActivo) {
        this.formGroup.get(i).enable();       
      }
      this.formGroup.get('ID').setValue(this.contratoActivo.id);
      this.formGroup.get('qn_estadoContrato').setValue(20);
    }    
    let contrato = Object.assign({}, this.formGroup.value);   
    this.registrar(contrato);        
  }

  public uploadFinished = (event) => {
    this.response = event;
    this.formGroup.get('txt_archivoContrato').setValue(this.response.dbPath.replace(/\\/g, "/"));
  }

  registrar(contrato: any) {
    let contratos;
    contrato.txt_archivoContrato = contrato.txt_archivoContrato.replace(/\\/g, "/");
    if(contrato.id===0){
      this.contratosService.postContrato(contrato).subscribe(contratoDesdeWS => contratos = contratoDesdeWS, error => this.showError(), () => this.showSuccess("¡Ingreso de dato exitoso!!", contratos));
    }else{
      this.contratosService.putContrato(contrato).subscribe(contratoDesdeWS => contratos = contratoDesdeWS, error => this.showError(), () => this.showSuccess("¡Ingreso de dato exitoso!!", contrato));
    }
    
  }

  get unidadSeleccionada(){
    let unidadId = this.formGroup.get('qn_unidadConsolidadora').value;
    let selected = this.unidades.find( u => u.id == unidadId);
    return selected;
  }
  // Metodo para decirle al usuario que todo salio correcto
  showSuccess(mensaje: string, contrato: any) {
    this.formGroup.reset();
    this.crearHistorial("Se ingreso un nuevo contrato con codigo " + contrato.txt_codigoContrato, contrato.id);
    this.crearVencimiento(contrato);
    this.toastr.success(mensaje, 'Success!');
    this.router.navigate(['/Lista-Contratos']);
  }

  //Instancia para el historial
  crearHistorial(mensaje: string, idContrato: number) {
    this.historialForm(mensaje, idContrato);
    let historial = this.formHistorial.value;
    this.historialService.postHistorial(historial).subscribe((data: any) => historial = data);
  }

  historialForm(mensaje: string, id: number){
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formHistorial = this.formBuilder.group({
      ID: 0,
      txt_seccionHistorial: "Contrato",
      txt_accionHistorial: mensaje,
      dt_fechaUltimoCambio: today,
      contratoID: id
    });
  }

  // Instancia para el vencimiento
  crearVencimiento(contrato: any) {
    this.vencimientoForm(contrato);
    let vencimiento = this.formVencimiento.value;
    this.expirationService.postVencimientoView(vencimiento).subscribe((data: any) => vencimiento = data);
  }

  public vencimientoForm(contrato: any) {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formVencimiento = this.formBuilder.group({
      ID: 0,
      txt_nombreSeccion: 'Contrato',
      dt_fechaVencimiento: contrato.dt_fechaFin,
      qn_diasAnticipacion: '30',
      qn_frecuenciaAnticipacion: '5',
      dt_fechaUltimoCambio: today,
      contratoID: contrato.id      
    });
  }

  showError() {
    this.toastr.error('A ocurrido un error en el servidor!', 'Error!');
  }

  get ruc() { return this.formGroup.get('txt_rucProveedor'); }
  get nombreProveedor() { return this.formGroup.get('txt_nombreProveedor'); }
  get codigo() { return this.formGroup.get('txt_codigoContrato'); }
  get numProceso() { return this.formGroup.get('txt_numProceso'); }
  get vigencia() { return this.formGroup.get('qn_vigenciaContrato'); }
  get fechaIni() { return this.formGroup.get('dt_fechaInicio'); }
  get fechaFin() { return this.formGroup.get('dt_fechaFin'); }
  get fehaSubs() { return this.formGroup.get('dt_fechaSuscripcion'); }
  get archivo() { return this.formGroup.get('txt_archivoContrato'); }
  get objContratacion() { return this.formGroup.get('txt_objetoContratacion'); }
  get monto() { return this.formGroup.get('vm_montoAdjudicado'); }
  get delegado() { return this.formGroup.get('txt_nombreDelegado'); }
  get tecnico() { return this.formGroup.get('txt_nombreTecnicoExterno'); }
  get unidad() { return this.formGroup.get('qn_unidadConsolidadora'); }
  get contratoTipo() { return this.formGroup.get('qn_tipoContrato'); }
  get tipoProceso() { return this.formGroup.get('qn_tipoProceso'); }
  get unidadConsolidadora() { return this.formGroup.get('qn_unidadConsolidadora'); }
}
