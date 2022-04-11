import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from  "@angular/router";
import * as CryptoJS from 'crypto-js';
import { AdminService } from 'src/app/servicios/admin/admin.service';
declare function swalError(mensaje:any): any;
declare function swalOk(mensaje:any): any;
declare function swalDelete(id:any, path:any) : any ;
@Component({
  selector: 'app-publicidad',
  templateUrl: './publicidad.component.html',
  styleUrls: ['./publicidad.component.css']
})
export class PublicidadComponent implements OnInit {
  result:any;
  img1: any = 0;
  urlImgs:any = [];
  selectOpt:any = 0;
  usuario:any = 'Publicidad';
  urlimg = 'http://189.129.194.231:81/imgs/';
  constructor(public  router:  Router, private adminService: AdminService, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.init();
  }

  init(){
    window['angularComponentReferenceDeleteImg'] = { component: this, zone: this.ngZone, loadAngularFunction: (id: any, path:any) => this.eliminar(id, path)};
    if(localStorage.getItem('dist2')!=null){
      const itemStr = localStorage.getItem('dist2') || '{}';
      const item = JSON.parse(itemStr);
      const now = new Date();
      if(now.getTime() > item) {
        localStorage.removeItem('dist2');
        localStorage.removeItem('dist');
      }
      if(localStorage.getItem('dist')!=null){
        var decrypted = CryptoJS.AES.decrypt(localStorage.getItem('dist') || '{}', "data");
        var result:any = decrypted.toString(CryptoJS.enc.Utf8);
        this.result = JSON.parse(result);
        if(this.result.accessToken==''){
          this.router.navigate(['/login']);
        }else{
          this.adminService.init();
          this.getImages('nacimiento');
        }
      }else{
        this.router.navigate(['/login']);
      }
    }else{
      this.router.navigate(['/login']);
    }
  }

  preview1(element){    
    this.img1=<File>element.target.files[0];
  }
  addImg(){
    if(this.selectOpt != 0 && this.img1 != 0){
      this.adminService.addImg(this.img1, this.selectOpt);
    }
  }

  getImages(categoria:any){
    this.adminService.getImages(categoria).subscribe(data => {
      this.urlImgs = data;
    },error => {
      console.log(error)
      swalError("Error 501, contacte al departamento de software!");
    });
  }

  selectOption(element){
    if(element.target.value != 0){
      this.selectOpt = element.target.value;
    }
  }

  descargar(){
    this.adminService.descargarImgs().subscribe(data => {
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "publicidad.zip";
      link.click();  
    },error => {
      console.log(error)
      swalError("Error 501, contacte al departamento de software!");
    });
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  eliminarModal(id:any, path:any){
    swalDelete(id, path);
  }

  eliminar(id:any, path:any){
    console.log(id)
    this.adminService.deleteImg(id, path).subscribe(res => {
      swalOk("Borrado correctamente");
      setTimeout(function(){
            location.reload();
      },1300);
    },error => {
      console.log(error)
      swalError("Error 501, contacte al departamento de software!");
    });
  }
}
