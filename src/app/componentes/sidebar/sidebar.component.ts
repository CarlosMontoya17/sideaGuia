import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/servicios/admin/admin.service';
import { Router } from  "@angular/router";
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  result:any;
  usuario:any;
  elementosOcultos = true;
  public routerLinkVariable = "/historial";

  constructor(private adminService: AdminService, public  router:  Router) {
   }

  ngOnInit(): void {
    this.init();
  }
  init(){
    if(localStorage.getItem('dist')!=null){
      var decrypted = CryptoJS.AES.decrypt(localStorage.getItem('dist') || '{}', "data");
      var result:any = decrypted.toString(CryptoJS.enc.Utf8);
      this.result = JSON.parse(result);
    }
  }
}
