import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/services/security.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AuthUser } from 'src/app/model.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.component.html',
  styleUrls: ['./home2.component.css']
})
export class Home2Component implements OnInit {
  
  userAuth: AuthUser;
  _userIs: boolean;
  datos: any;

  formGroup: FormGroup;
  titleAlert: string = 'This field is required';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: AuthService,
    private securityService: SecurityService
    ) { 
      
    }

  ngOnInit() {
    this._userIs = true;
    this.userService.getUser().subscribe(data => {
      console.log(data);
      if(data.usuario != ''){        
        if(data.rol === "Administrador-Contrato"){
          this.userAuth = {
            id: data.usuario[0].id,
            nombres: data.usuario[0].txt_nombre,
            apellidos: data.usuario[0].txt_apellido,
            email: data.usuario[0].txt_username.toLowerCase() + '@espol.edu.ec',
            rol: data.rol,
            ultimoAcceso: data.ultimoAcceso
          };        
        }
        else{
          this.userAuth = {
            id: data.usuario.id,
            nombres: data.usuario.nombre,
            apellidos: data.usuario.apellido,
            email: data.usuario.usuario.toLowerCase() + '@espol.edu.ec',
            rol: data.usuario.nombreRol,
            ultimoAcceso: data.ultimoAcceso
          };
        }
      }
      else{
        this.createForm();
        this._userIs = !this._userIs;
        this.registrarUsuario(data);
      }      
      this.securityService.SetAuthData(data.token.value.response, this.userAuth);
      this.userService.userAuth$.emit(this.userAuth);
      this.redirect(this.userAuth.rol);
    }, error => console.log(error));
  }

  registrarUsuario(data: any){
    this.formGroup.get('txt_username').setValue(data.username);
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'txt_nombre': [null, Validators.required],
      'txt_username': [null, Validators.required],
      'txt_apellido': [null, Validators.required]
    });
  }  

  redirect(rol: any){
    if(rol === 'Administrador del Sistema'){
      this.router.navigate(["/Configuracion"]);
    }else{
      this.router.navigate(["/Lista-Contratos"]);
    }        
  }

}
