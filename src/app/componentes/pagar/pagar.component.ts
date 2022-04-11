import {Component,ElementRef,OnInit, ViewChild} from '@angular/core';
import { AdminService } from 'src/app/servicios/admin/admin.service';
import { Router } from  "@angular/router";
import { jsPDF } from "jspdf";
import "jspdf/dist/polyfills.es.js";
import * as CryptoJS from 'crypto-js';
import { StripeService } from 'ngx-stripe';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
declare function swalOkPago(mensaje:any): any;
declare function swalError(mensaje:any): any;

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.css']
})

export class PagarComponent implements OnInit{

  constructor(public  router:  Router, private adminService: AdminService, private stripeService: StripeService, private http: HttpClient){}
  result:any;
  handler:any = null;
  fileComprobante:any=0;
  ngOnInit() {
    this.init();
  }

  addComprobante(){
    if(this.fileComprobante != 0){
      this.adminService.addImgComprobante(this.result.id, this.fileComprobante);
    }
  }

  changeComprobante(element){
    this.fileComprobante=<File>element.target.files[0];
  }

  generatePDF(): void {
    if(this.result.saldo>0){
      var imgData = 'assets/images/fichaDigital2.jpg'
      const doc = new jsPDF();
      doc.addImage(imgData, 'JPEG', 20, 20, 180, 220)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('$ '+this.result.saldo.toString()+'.00', 130, 45);
      doc.save('ReferenciaOXXO.pdf')
    }else{
      swalError("Tu saldo debe ser mayor a \n $ 0.00 mxn");
    }
  }

  checkout() {
    if(this.result.saldo>0){
      this.http.post('http://189.129.194.231:81/create-checkout-session', {pago : this.result.saldo, id:this.result.id})
        .pipe(
          switchMap((session:any) => {
            return this.stripeService.redirectToCheckout({ sessionId: session.id })
          })
        ).subscribe(result => {
          console.log(result)
          // If `redirectToCheckout` fails due to a browser or network
          // error, you should display the localized error message to your
          // customer using `error.message`.
          if (result.error) {
            alert(result.error.message);
          }
      });
    }else{
      swalError("Tu saldo debe ser mayor a \n $ 0.00 mxn");
    }
  }

  init(){
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
        if(this.result.accessToken!='' && this.result.rol =='cliente'){
          this.adminService.init();
          this.checkUrl();
          
        }else if(this.result.rol=='publicidad'){
          this.router.navigate(['/publicidad']);
        }else{
          this.router.navigate(['/login']);
        }
      }else{
        this.router.navigate(['/login']);
      }
    }else{
      this.router.navigate(['/login']);
    }
  }

  checkUrl(){
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get('pay') == 'true'){
      swalOkPago('Muchas gracias por tu pago!');
      this.adminService.getData(this.result.id).subscribe(res => {
        this.result = res[0];
        var encrypted = CryptoJS.AES.encrypt(JSON.stringify(this.result), "data");
        localStorage.setItem('dist', encrypted.toString());
      },(error:any)=> {
        console.log(error)
        swalError("Contacte al departamento de software!");
      });
    }else if(urlParams.get('pay') == 'false'){
      swalError('El pago se ha cancelado');
    }
  }
}

