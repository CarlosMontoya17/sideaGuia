import { Component, OnInit } from '@angular/core';
import { AuthService } from  'src/app/servicios/auth/auth.service';
import { Router } from  "@angular/router";
declare function validateLogin(): any;
import * as CryptoJS from 'crypto-js';
declare function swalError(mensaje:any): any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:any;
  password:any;
  dataLogin:any = [];
  constructor(private authService: AuthService, public  router:  Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('dist2')!=null && localStorage.getItem('dist')!=null){
      const itemStr = localStorage.getItem('dist2') || '{}';
      const item = JSON.parse(itemStr);
      const now = new Date();
      if(now.getTime() > item) {
        localStorage.removeItem('dist2');
        localStorage.removeItem('dist');
        location.reload();
      }else{
        this.router.navigate(['/inicio']);
      }
    }
  }

  validarLogin(username:any, password:any){  
    if(validateLogin()){
      this.authService.login(username, password).subscribe(res => {
        this.dataLogin = res;
        var encrypted = CryptoJS.AES.encrypt(JSON.stringify(this.dataLogin), "data");
        const now = new Date();
        localStorage.setItem('dist', encrypted.toString());
        localStorage.setItem('dist2', JSON.stringify(now.getTime()+18000000));
        this.router.navigate(['/inicio']);
      },error=> {
        swalError("Credenciales incorrectas");
      });
    }
  }
}