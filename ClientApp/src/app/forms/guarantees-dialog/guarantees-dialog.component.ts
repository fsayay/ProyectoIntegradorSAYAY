import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tipo } from 'src/app/model.component';
import { CatalogService } from 'src/app/views/setting/catalog/catalog.service';
import { DatePipe, formatCurrency, getCurrencySymbol } from '@angular/common';
import { Observable } from 'rxjs';
import { ProveedorService } from 'src/app/views/setting/proveedor/proveedor.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-guarantees-dialog',
  templateUrl: './guarantees-dialog.component.html',
  styleUrls: ['./guarantees-dialog.component.css']
})
export class GuaranteesDialogComponent implements OnInit {

  // Autocomplete with mat-autocomplete
  proveedorCtrl: FormControl = new FormControl();
  plazoCtrl: FormControl = new FormControl();
  filteredProveedor: Observable<any[]>;
  statesProveedor: String[];
  proveedores: any[];
  proveedor: any;
  plazo: any;
  
  title: string;
  formGroup: FormGroup;
  cantidad: string='0';
  contratoActivo: any;
  tiposGarantia: Tipo[];
  public response: {dbPath: ''};
  fileName: string="";

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<GuaranteesDialogComponent>, @Inject(MAT_DIALOG_DATA) public data,
    private catalogoService: CatalogService,
    private proveedorService: ProveedorService,
    private datePipe: DatePipe
  ) { 
    this.catalogoService.getItem(2).subscribe(item => {
      this.tiposGarantia = item.tipos;
    })
  }

  ngOnInit() {
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
    this.createForm();
    if(this.data){
      this.title = "Modificar Garantia";
      this.formGroup.patchValue(this.data);
      this.formGroup.get('ID').setValue(this.data.id);
      this.proveedor = this.data.txt_proveedorGarantia;
      var fechaInicio = new Date(this.data.dt_inicioGarantia).getTime();
      var fechaFin    = new Date(this.data.dt_finGarantia).getTime();
      var diff = fechaFin - fechaInicio;
      this.plazo = diff/(1000*60*60*24);
      this.fileName = this.getFilePath(this.data.txt_archivoGarantia);
    }else{
      this.title = "Nueva Garantia";       
    }    
  }

  private createForm() {
    const today = this.datePipe.transform( new Date(),'yyyy-MM-dd HH:mm');
    this.formGroup = this.formBuilder.group({
      ID: 0,
      qn_tipoGarantia: ['', Validators.required],
      tipoGarantia: '',
      vm_valorGarantia: ['', Validators.required],
      txt_codigoGarantia: ['', Validators.required],
      txt_proveedorGarantia: ['', Validators.required],
      dt_inicioGarantia: ['', Validators.required],
      dt_finGarantia: ['', Validators.required],
      txt_archivoGarantia: ['', Validators.required],
      dt_fechaUltimoCambio: today,
      contratoID: this.contratoActivo.id
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

  filterStatesProveedor(name: string) {
    return this.statesProveedor.filter(state =>
      state.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  selectedProveedor(value: string){    
    this.proveedores.forEach( x => {
      if(x.txt_nombreProveedor == value)
      {
        this.formGroup.get('txt_proveedorGarantia').setValue(x.txt_nombreProveedor);       
      }      
    })
  }

  public uploadFinished = (event) => {
    this.response = event;
    this.formGroup.get('txt_archivoGarantia').setValue(this.response.dbPath.replace(/\\/g, "/"));
    this.fileName = this.getFilePath(this.formGroup.get('txt_archivoGarantia').value);
  }

  updatePlazo(value: string) {
    if(value != ''){
      var dias = parseInt(value);
      var fechaInicio = new Date(this.datePipe.transform(this.formGroup.get("dt_inicioGarantia").value, "yyyy-MM-dd"));
      fechaInicio.setDate(fechaInicio.getDate() + dias +1);
      this.formGroup.get('dt_finGarantia').setValue(this.datePipe.transform(fechaInicio, "yyyy-MM-dd"));
    }else{
      this.formGroup.get('dt_finGarantia').setValue('');
    }
    
  }

  updateValue(value: string) {
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    this.cantidad = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
  }

  obtenerTipo(tipo: any){    
    this.formGroup.get('tipoGarantia').setValue(tipo.txt_nombreTipo);
  }

  onSubmit() {
    
    this.formGroup.get('dt_inicioGarantia').setValue(this.datePipe.transform(this.formGroup.get('dt_inicioGarantia').value, "yyyy-MM-dd"));
    this.formGroup.get('dt_finGarantia').setValue(this.datePipe.transform(this.formGroup.get('dt_finGarantia').value, "yyyy-MM-dd"));    
    this.dialogRef.close(this.formGroup.value);
  }

  getFilePath(filePath: string) {
    const tempFileName = filePath.split('/');
    const nameFile = tempFileName[tempFileName.length - 1];
    return nameFile;
  }


}
