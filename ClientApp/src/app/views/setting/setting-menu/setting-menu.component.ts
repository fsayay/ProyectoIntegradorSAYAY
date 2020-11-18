import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-menu',
  templateUrl: './setting-menu.component.html',
  styleUrls: ['./setting-menu.component.css']
})
export class SettingMenuComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  enrutar(ruta: number){
    switch (ruta) {  
      case 1:  
        this.router.navigate([`/Configuracion/Usuarios`]);  
        break;
      case 2:  
        this.router.navigate([`/Configuracion/Roles`]);
        break;
      case 3:  
        this.router.navigate([`/Configuracion/Proveedores`]);
        break;
      case 4:  
        this.router.navigate([`/Configuracion/Unidad`]);
        break;          
      default:
        this.router.navigate([`/Configuracion`]);
        break;
     } 
  }

}
