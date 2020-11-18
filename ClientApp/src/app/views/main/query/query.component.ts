import { Component, OnInit } from '@angular/core';
import { Contrato, Tipo, Admin, User } from 'src/app/model.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CatalogService } from '../../setting/catalog/catalog.service';
import { Router } from '@angular/router';
import { ContractListService } from '../contracts/contract-list/contract-list.service';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MainMenuService } from '../main-menu/main-menu.service';
import { XlsxExportService } from 'src/app/sharedService/xlsx-export/xlsx-export.service';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { startWith, map } from 'rxjs/operators';
import { SecurityService } from 'src/app/services/security.service';
import { ProveedorService } from '../../setting/proveedor/proveedor.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html'
})
export class QueryComponent implements OnInit {

  // Autocomplete with mat-autocomplete
  administradorCtrl: FormControl = new FormControl();
  proveedorCtrl: FormControl = new FormControl();

  filteredAdmins: Observable<any[]>;
  filteredProveedor: Observable<any[]>;

  statesAdmin: String[];
  statesProveedor: String[];
 
  public contratos: any[];
  public contratosFiltrados: any = null;
  public formGroup: FormGroup;
  public tiposContrato: Tipo[];
  public estadosContrato: Tipo[];
  readonly: boolean;
  _isAdmin: boolean;

  admins: Admin[];

  userAuth: any;
  
  constructor(
    private formBuilder: FormBuilder,
    private catalogoService: CatalogService,
    private xlsxExportService: XlsxExportService,
    private router: Router,
    private titlecasePipe: TitleCasePipe,
    private contratoService: ContractListService,
    private proveedorService: ProveedorService,
    private datePipe: DatePipe,
    private mainMenuService: MainMenuService,
    private securityService:SecurityService
  ) {
    
    this.contratoService.getReportsView().subscribe( data => {
      if (data != ''){
        this.contratos = data;        
      }
    });   
    this.catalogoService.getItem(1).subscribe(item => {
      this.tiposContrato = item.tipos;
      this.catalogoService.getItem(10).subscribe(item => {
        this.estadosContrato = item.tipos;        
      });
    });

    
  }

  ngOnInit() {
    this._isAdmin = false; 
    this.userAuth = this.securityService.GetAuthUser();    
    this.mainMenuService.setIsDisabled(false);
    this.createForm();
    if(this.userAuth.rol == 'Administrador-Contrato')
    {
      this.formGroup.get('adminContrato').setValue(this.titlecasePipe.transform(this.userAuth.nombres +' '+this.userAuth.apellidos));
      this.readonly = true;
      this._isAdmin = true;
    }    
  }

  getAdministrador() {
    this.statesAdmin = new Array();
    this.catalogoService.getAdmins()
      .subscribe(data => {
        const newArr = []
        const myObj = {}        
        data.forEach(x => !(x.id in myObj) && (myObj[x.id] = true) && newArr.push(x))
        newArr.forEach(x => {
          this.statesAdmin.push(x.administrador);
        });        
        this.filteredAdmins = this.administradorCtrl.valueChanges
          .pipe(
          startWith(''),
          map(state => state ? this.filterStatesAdmin(state) : this.statesAdmin.slice())
          )
      })
  }

  getProveedor() {
    this.statesProveedor = new Array();
    this.proveedorService.getProveedor()
      .subscribe(data => {
        const newArr = []
        const myObj = {}        
        data.forEach(x => !(x.id in myObj) && (myObj[x.id] = true) && newArr.push(x))
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

  selectedAdmin(value: string){
    this.formGroup.get('adminContrato').setValue(value);
  }

  selectedProveedor(value: string){
    this.formGroup.get('proveedor').setValue(value);
  }

  filterStatesAdmin(name: string) {
    return this.statesAdmin.filter(state =>
      state.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterStatesProveedor(name: string) {
    return this.statesProveedor.filter(state =>
      state.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  private createForm() {
    this.formGroup = this.formBuilder.group({
      codigoContrato: [''],
      adminContrato: [''],
      estadoContrato: ['', Validators.required],
      codigoProceso: [''],
      proveedor: [''],
      tipoContrato: [''],
      fechaSubs1: [''],
      fechaSubs2: [''],
      fechaInicio1: [''],
      fechaInicio2: [''],
      fechaFin1: [''],
      fechaFin2: ['']
    });
  }

  consultar() {
    this.filtrar();
  }

  verDetalle(id: number){
    localStorage.setItem('idContratoActivo', JSON.stringify(id));
    this.router.navigate(["/Contrato/" + id]);
  }

  mostrarHistorial(contratoId: string) {
    this.router.navigate(["/Historial"]);
  }

  filtrar() {
    this.contratosFiltrados = [];
    this.contratos.forEach(x => {
      if (x.estado == this.formGroup.get('estadoContrato').value) {
        this.contratosFiltrados.push(x);        
      }
    });

    // Por Fecha de Suscripcion
    if (this.formGroup.get('fechaSubs1').value != "" && this.formGroup.get('fechaSubs2').value != "") {
      var fechaSub1 = new Date(this.datePipe.transform(this.formGroup.get('fechaSubs1').value, "yyyy-MM-dd"));
        var fechaSub2 = new Date(this.datePipe.transform(this.formGroup.get('fechaSubs2').value, "yyyy-MM-dd"));
        let d1 = fechaSub1.getTime();
        let d2 = fechaSub2.getTime();
        this.contratosFiltrados.forEach(y => {
          let d3 = (new Date(y.fecha_de_Suscripcion)).getTime();
          if (d3 > d2 || d3 < d1) {
            var i = this.contratosFiltrados.indexOf(y);
            i !== -1 && this.contratosFiltrados.splice(i, 1);
          }
        });
    }

    // Por Tipo de Contrato
    if (this.formGroup.get('tipoContrato').value != "") {
      this.contratosFiltrados.forEach(x => {
        if (x.tipo_de_Contrato != this.formGroup.get('tipoContrato').value) {
          var i = this.contratosFiltrados.indexOf(x);
          i !== -1 && this.contratosFiltrados.splice(i, 1);
        }
      });
    }

    // Por Fecha de Inicio
    if (this.formGroup.get('fechaInicio1').value != "" && this.formGroup.get('fechaInicio2').value != "") {
      var fechaIni1 = new Date(this.datePipe.transform(this.formGroup.get('fechaInicio1').value, "yyyy-MM-dd"));
      var fechaIni2 = new Date(this.datePipe.transform(this.formGroup.get('fechaInicio2').value, "yyyy-MM-dd"));
      let d1 = fechaIni1.getTime();
      let d2 = fechaIni2.getTime();
      this.contratosFiltrados.forEach(y => {
        let d3 = (new Date(y.fecha_de_Inicio_del_Contrato)).getTime();
        if (d3 > d2 || d3 < d1) {
          var i = this.contratosFiltrados.indexOf(y);
          i !== -1 && this.contratosFiltrados.splice(i, 1);
        }
      });
    }

    // Por Fecha de Finalización
    if (this.formGroup.get('fechaFin1').value != "" && this.formGroup.get('fechaFin2').value != "") {
      var fechaF1 = new Date(this.datePipe.transform(this.formGroup.get('fechaFin1').value, "yyyy-MM-dd"));
      var fechaF2 = new Date(this.datePipe.transform(this.formGroup.get('fechaFin2').value, "yyyy-MM-dd"));
      let d1 = fechaF1.getTime();
      let d2 = fechaF2.getTime();
      this.contratosFiltrados.forEach(y => {
        let d3 = (new Date(y.fecha_de_Finalizacion_del_Contrato)).getTime();
        if (d3 > d2 || d3 < d1) {
          var i = this.contratosFiltrados.indexOf(y);
          i !== -1 && this.contratosFiltrados.splice(i, 1);
        }
      });
    }

    // por Administrador
    if (this.formGroup.get('adminContrato').value != "" ) {
      this.contratosFiltrados.forEach(x => {
        if (x.nombre_del_Administrador.toLocaleLowerCase() != (this.formGroup.get('adminContrato').value).toLocaleLowerCase()) {
          var i = this.contratosFiltrados.indexOf(x);
          i !== -1 && this.contratosFiltrados.splice(i, 1);
        }
      });
    }

    // por Proveedor
    if (this.formGroup.get('proveedor').value != "") {
      this.contratosFiltrados.forEach(x => {
        if (x.nombre_del_Contratista.toLocaleLowerCase() != (this.formGroup.get('proveedor').value).toLocaleLowerCase()) {
          var i = this.contratosFiltrados.indexOf(x);
          i !== -1 && this.contratosFiltrados.splice(i, 1);
        }
      });
    }

    // Por Codigo Contrato
    if (this.formGroup.get('codigoContrato').value != "") {
      this.contratosFiltrados.forEach(x => {
        if (x.codigo_del_Contrato != this.formGroup.get('codigoContrato').value) {
          var i = this.contratosFiltrados.indexOf(x);
          i !== -1 && this.contratosFiltrados.splice(i, 1);
        }
      });
    }

    // Por Codigo Proceso
    if (this.formGroup.get('codigoProceso').value != "") {
      this.contratosFiltrados.forEach(x => {
        if (x.codigo_de_Proceso != this.formGroup.get('codigoProceso').value) {
          var i = this.contratosFiltrados.indexOf(x);
          i !== -1 && this.contratosFiltrados.splice(i, 1);
        }
      });
    }
  }

  exportAsXLSX(): void{
    this.xlsxExportService.exportToExcel(this.contratosFiltrados, 'reporte');
  }

}


interface States {
  key: string;
}