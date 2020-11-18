import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, CommonModule, TitleCasePipe } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { PdfViewerModule  } from '@syncfusion/ej2-angular-pdfviewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { FullCalendarModule } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

registerLocaleData(localeEs);

// Component List
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './views/footer/footer.component';
import { HeaderComponent } from './views/header/header.component';
import { MainMenuComponent } from './views/main/main-menu/main-menu.component';
import { ContractListComponent } from './views/main/contracts/contract-list/contract-list.component';
import { DeliverablesComponent } from './views/main/contracts/deliverables/deliverables.component';
import { ExpirationsComponent } from './views/main/contracts/expirations/expirations.component';
import { GeneralDataComponent } from './views/main/contracts/general-data/general-data.component';
import { GuaranteesComponent } from './views/main/contracts/guarantees/guarantees.component';
import { ModificationsComponent } from './views/main/contracts/modifications/modifications.component';
import { PaymentsComponent } from './views/main/contracts/payments/payments.component';
import { PenaltyComponent } from './views/main/contracts/penalty/penalty.component';
import { ProceedingsComponent } from './views/main/contracts/proceedings/proceedings.component';
import { ReportsComponent } from './views/main/contracts/reports/reports.component';
import { QueryComponent } from './views/main/query/query.component';
import { RecordComponent } from './views/main/record/record.component';
import { Page404Component } from './page404/page404.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './material/angular-material/angular-material.module';
import { Home2Component } from './views/home2/home2.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { NewContractComponent } from './views/main/contracts/new-contract/new-contract.component';

// importar Formularios en los Dialog Material
import { GuaranteesDialogComponent } from './forms/guarantees-dialog/guarantees-dialog.component';
import { PaymentsDialogComponent } from './forms/payments-dialog/payments-dialog.component';
import { DeliverablesDialogComponent } from './forms/deliverables-dialog/deliverables-dialog.component';
import { ExpirationsDialogComponent } from './forms/expirations-dialog/expirations-dialog.component';
import { TransfersDialogComponent } from './forms/transfers-dialog/transfers-dialog.component';
import { ModificationsDialogComponent } from './forms/modifications-dialog/modifications-dialog.component';
import { ReportsDialogComponent } from './forms/reports-dialog/reports-dialog.component';
import { PenaltiesDialogComponent } from './forms/penalties-dialog/penalties-dialog.component';
import { ProceedingsDialogComponent } from './forms/proceedings-dialog/proceedings-dialog.component';
import { DashboardComponent } from './views/main/dashboard/dashboard.component';
import { ComparativeComponent } from './graphics/comparative/comparative.component';
import { GlobalComponent } from './graphics/global/global.component';
import { HistoricalComponent } from './graphics/historical/historical.component';
import { UploadComponent } from './upload/upload/upload.component';
import { InformeMultaComponent } from './forms/informe-multa/informe-multa.component';
import { TransferRequestComponent } from './views/main/contracts/transfer-request/transfer-request.component';
import { CatalogDialogComponent } from './forms/catalog-dialog/catalog-dialog.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogComponent } from './views/setting/catalog/catalog.component';
import { RolComponent } from './views/setting/rol/rol.component';
import { UsuarioComponent } from './views/setting/usuario/usuario.component';
import { SettingMenuComponent } from './views/setting/setting-menu/setting-menu.component';
import { TipoCatalogoComponent } from './views/setting/tipo-catalogo/tipo-catalogo.component';
import { RolDialogComponent } from './forms/rol-dialog/rol-dialog.component';
import { UserRolDialogComponent } from './forms/user-rol-dialog/user-rol-dialog.component';
import { TypeDialogComponent } from './forms/type-dialog/type-dialog.component';
import { UsersDialogComponent } from './forms/users-dialog/users-dialog.component';
import { CurDialogComponent } from './forms/cur-dialog/cur-dialog.component';
import { PdfLoaderComponent } from './sharedService/pdf-loader/pdf-loader.component';
import { DeliverableFileDialogComponent } from './forms/deliverable-file-dialog/deliverable-file-dialog.component';
import { NewTransferRequestComponent } from './views/main/contracts/new-transfer-request/new-transfer-request.component';
import { TransferResponseDialogComponent } from './forms/transfer-response-dialog/transfer-response-dialog.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SignalRGraphicComponent } from './graphics/signal-rgraphic/signal-rgraphic.component';
import { AuthGuard } from './services/auth.guard';
import { FullcalendarViewComponent } from './views/main/contracts/fullcalendar-view/fullcalendar-view.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getDutchPaginatorIntl } from './dutch-paginator-intl';
import { UpdatePayComponent } from './forms/update-pay/update-pay.component';
import { DonutComponent } from './graphics/donut/donut.component';
import { SemidonutComponent } from './graphics/semidonut/semidonut.component';
import { ProveedorComponent } from './views/setting/proveedor/proveedor.component';
import { ProveedorDialogComponent } from './forms/proveedor-dialog/proveedor-dialog.component';
import { UnidadComponent } from './views/setting/unidad/unidad.component';
import { UnidadDialogComponent } from './forms/unidad-dialog/unidad-dialog.component';


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  timeGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    Home2Component,
    FooterComponent,
    HeaderComponent,
    QueryComponent,
    RecordComponent,
    MainMenuComponent,
    UploadComponent,
    ContractListComponent,
    DeliverablesComponent,
    ExpirationsComponent,
    FullcalendarViewComponent,
    GeneralDataComponent,
    GuaranteesComponent,
    ModificationsComponent,
    TipoCatalogoComponent,
    PaymentsComponent,
    PenaltyComponent,
    ProceedingsComponent,
    NewContractComponent,
    NewTransferRequestComponent,
    ReportsComponent,
    DashboardComponent,
    Page404Component,
    GuaranteesDialogComponent,
    ProveedorDialogComponent,
    UnidadComponent,
    UnidadDialogComponent,
    PaymentsDialogComponent,
    CurDialogComponent,
    SignalRGraphicComponent,
    DeliverablesDialogComponent,
    InformeMultaComponent,
    UsersDialogComponent,
    PdfLoaderComponent,
    ExpirationsDialogComponent,
    TransfersDialogComponent,
    TransferResponseDialogComponent,
    ModificationsDialogComponent,
    UpdatePayComponent,
    ReportsDialogComponent,
    PenaltiesDialogComponent,
    CatalogDialogComponent,
    RolDialogComponent,
    UserRolDialogComponent,
    TypeDialogComponent,
    TransferRequestComponent,
    ProceedingsDialogComponent,
    DeliverableFileDialogComponent,
    ComparativeComponent,
    DonutComponent,
    SemidonutComponent,
    GlobalComponent,
    CatalogComponent,
    RolComponent,
    UsuarioComponent,
    ProveedorComponent,
    SettingMenuComponent,
    HistoricalComponent
  ],
  imports: [
    CommonModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    PdfViewerModule,
    NgbModule,
    FullCalendarModule,
    AutocompleteLibModule, 
    NgxPaginationModule,
    ChartsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    CurrencyMaskModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'home', component: Home2Component},
      { path: 'Lista-Contratos', component: ContractListComponent, canActivate: [AuthGuard] },
      { path: 'Contrato/Registro', component: NewContractComponent, canActivate: [AuthGuard] },
      { path: 'Contrato/:id', component: GeneralDataComponent, canActivate: [AuthGuard] },
      { path: 'Contrato/:id/Actas', component: ProceedingsComponent, canActivate: [AuthGuard] },
      { path: 'Contrato/:id/Garantias', component: GuaranteesComponent, canActivate: [AuthGuard] },
      { path: 'Contrato/:id/Entregables', component: DeliverablesComponent, canActivate: [AuthGuard] },
      { path: 'Contrato/:id/Modificaciones', component: ModificationsComponent, canActivate: [AuthGuard] },
      { path: 'Contrato/:id/Vencimientos', component: ExpirationsComponent, canActivate: [AuthGuard] },
      { path: 'Contrato/:id/Vencimientos/Calendario', component: FullcalendarViewComponent, canActivate: [AuthGuard] },
      { path: 'Contrato/:id/Multas', component: PenaltyComponent, canActivate: [AuthGuard] },
      { path: 'Contrato/:id/Informes', component: ReportsComponent, canActivate: [AuthGuard] },
      { path: 'Contrato/:id/Pagos', component: PaymentsComponent, canActivate: [AuthGuard] },
      { path: 'Nuevo Contrato', component: NewContractComponent, canActivate: [AuthGuard] },
      { path: 'Solicitudes/Tranferir-Contratos', component: NewTransferRequestComponent, canActivate: [AuthGuard]},
      { path: 'Solicitudes/Tranferir-Contratos/:id', component: NewTransferRequestComponent, canActivate: [AuthGuard]},
      { path: 'Solicitudes', component: TransferRequestComponent, canActivate: [AuthGuard] },
      { path: 'Historial', component: RecordComponent, canActivate: [AuthGuard] },
      { path: 'Reportes', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'Consulta-Generica', component: QueryComponent, canActivate: [AuthGuard]},
      { path: 'Configuracion', component: CatalogComponent, canActivate: [AuthGuard] },
      { path: 'Configuracion/Roles', component: RolComponent, canActivate: [AuthGuard] },
      { path: 'Configuracion/Proveedores', component: ProveedorComponent, canActivate: [AuthGuard] },
      { path: 'Configuracion/Unidad', component: UnidadComponent, canActivate: [AuthGuard] },
      { path: 'Catalogo/Tipos', component: TipoCatalogoComponent, canActivate: [AuthGuard] },
      { path: 'Configuracion/Usuarios', component: UsuarioComponent, canActivate: [AuthGuard] },
      { path: '**', component: Page404Component }
    ]),
    BrowserAnimationsModule,
    AngularMaterialModule,
    NgbModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    CookieService,
    NgbActiveModal,
    TitleCasePipe,
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es'},
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl()
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    GuaranteesDialogComponent
  ]
})
export class AppModule { }
