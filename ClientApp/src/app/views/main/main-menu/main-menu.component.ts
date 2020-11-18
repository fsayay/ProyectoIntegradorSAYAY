import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MainMenuService } from './main-menu.service';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent {

  isAuthenticated: boolean;
  contratoActivo: any;
  userAuth: any;

  myWorkRoutes = [
    { icon: "1", title: "primero"},
    { icon: "2", title: "Segundo" },
    { icon: "3", title: "Tercero" },
    { icon: "4", title: "Cuarto" },
    { icon: "5", title: "Quinto" },
  ]

  @ViewChild("ulContrato", {static: false}) ulContrato: ElementRef;
  isDisabled: boolean;

  constructor(
    private router: Router,
    private mainMenuService: MainMenuService,
    private securityService: SecurityService
     ) { }

  ngOnInit(){
    this.isDisabled = this.mainMenuService.getIsDisabled();
    this.userAuth = this.securityService.GetAuthUser();
    this.contratoActivo = JSON.parse(localStorage.getItem('contratoActivo'));
  }
  enrutar(ruta: number){
    switch (ruta) {  
      case 1:  
      this.router.navigate([`/Contrato/${this.contratoActivo.id}`]);  
       break;
      case 2:  
      this.router.navigate([`/Contrato/${this.contratoActivo.id}/Garantias`]);
       break;
       case 3:  
       this.router.navigate([`/Contrato/${this.contratoActivo.id}/Pagos`]);
       break;
       case 4:  
       this.router.navigate([`/Contrato/${this.contratoActivo.id}/Entregables`]);
       break;
       case 5:  
       this.router.navigate([`/Contrato/${this.contratoActivo.id}/Modificaciones`]);
       break;
       case 6:  
       this.router.navigate([`/Contrato/${this.contratoActivo.id}/Informes`]);
       break;
       case 7:  
       this.router.navigate([`/Contrato/${this.contratoActivo.id}/Multas`]);
       break;
       case 8:  
       this.router.navigate([`/Contrato/${this.contratoActivo.id}/Actas`]);
       break;
       case 9:  
       this.router.navigate([`/Contrato/${this.contratoActivo.id}/Vencimientos`]);
       break;
       case 10:  
       this.router.navigate([`/Solicitudes`]);
       break;
       default:
         this.router.navigate([`/Lista-Contratos`]);
       break;
     } 
  }

}
