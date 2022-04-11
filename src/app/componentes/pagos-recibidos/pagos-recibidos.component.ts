import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AdminService } from 'src/app/servicios/admin/admin.service';
import * as CryptoJS from 'crypto-js';
declare function swalError(mensaje:any): any;

@Component({
  selector: 'app-pagos-recibidos',
  templateUrl: './pagos-recibidos.component.html',
  styleUrls: ['./pagos-recibidos.component.css']
})
export class PagosRecibidosComponent implements OnInit {
  inicioCorte:any;
  finCorte:any;
  result:any;
  data:any=[];
  ganancia:any = [];
  totalCiber:any=[];
  totalAPagar:any=[];
  totalAdmin:any=[];
  dataPrecios:any=[];
  cortesFechas:any=[];
  cortes:any=[];
  panelPrincipal = 0;
  totalPagar =0;
  totalGanancia =0;
  totalPagarCorte =0;
  totalGananciaCorte =0;
  
  constructor(public  router:  Router, private adminService: AdminService) { }

  ngOnInit(): void {
    this.init();
  }

  getData(){
    this.adminService.getIdsUsers(this.result.id).subscribe(res => {
      this.data = res;
      this.getPreciosHistorial(this.inicioCorte.slice(0,10)+this.finCorte.slice(0,10));
    },(error:any)=> {
      swalError("Contacte al departamento de software.");
    });
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
        if(this.result.accessToken!=''){
          if(this.result.rol!='cliente' && this.result.rol!='publicidad'){
            this.obtenerFechaCorte();
            this.adminService.init();
            this.getCortes();
            this.getData();
          }else{
            this.router.navigate(['/inicio']);
          }
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

  getPreciosHistorial(cortes:any){
    if(this.result.rol=='admin'){
      for(var x=0; x<this.data.length; x++){
        var contador = 0;
        this.adminService.getPricesHistorial(this.data[x].id, this.result.id, cortes.slice(0,10) + ' 00:00:00', cortes.slice(10,21)+ ' 18:59:59').subscribe(res => {
          var array:any = res;
          if(array.length>0){
            var ciber = 0;
            var aPagar = 0;
            for(var y=0; y<array.length; y++){
              ciber = ciber + array[y].costo;
              aPagar = aPagar + (array[y].costo - array[y].precioEjecutivo);
            }

            this.totalPagar = this.totalPagar + aPagar;
            this.totalGanancia = this.totalGanancia + ciber - aPagar + this.data[contador].saldo;
            contador++;
            this.totalCiber[array[0].idEjecutivo] = ciber;
            this.totalAPagar[array[0].idEjecutivo]= aPagar;
          }
          else{
            this.totalGanancia = this.totalGanancia + this.data[contador].saldo;
            contador++;
          }
        },
        (error:any)=> {
          swalError("Contacte al departamento de software.");
        });
      }
    
    }else if(this.result.rol=='ejecutivo'){
      var contador =0;
      for(var x=0; x<this.data.length; x++){
        
        this.adminService.getPricesHistorial2(this.data[x].id, this.data[x].idEjecutivo, cortes.slice(0,10) + ' 00:00:00', cortes.slice(10,21)+ ' 18:59:59').subscribe(res => {
          var array:any = res;
          if(array.length>0){
            //console.log(array)
            var ciber = 0;
            var aPagar = 0;
            
            for(var y=0; y<array.length; y++){
              ciber = ciber + array[y].costo;
              aPagar = aPagar + array[y].precioEjecutivo;
            }
            this.totalCiber[array[0].idUsuario] = ciber;
            this.totalPagar = this.totalPagar + aPagar;
            this.totalGanancia = this.totalGanancia + (ciber - aPagar);
            //console.log(this.totalGanancia)
            
            this.totalAPagar[array[0].idUsuario]= aPagar;
          } 
        },
        (error:any)=> {
          swalError("Contacte al departamento de software.2");
        });
      }
    }
  }
  
  obtenerFechaCorte(){
    var today = new Date();
    var todayNumber = today.getDay();
    if(todayNumber == 6){
       this.inicioCorte = today;
    }else{
      this.inicioCorte = new Date(today);
      this.inicioCorte.setDate(this.inicioCorte.getDate() - (this.inicioCorte.getDay() + 1));
    }
    if(todayNumber == 5){
      this.finCorte = today;
    }else{
      this.finCorte = new Date(today);
      this.finCorte.setDate(this.finCorte.getDate() + (5 + 7 - this.finCorte.getDay()) % 7);
    }
    this.inicioCorte = this.inicioCorte.toISOString();//.slice(0,10) + ' 00:00:00';
    this.finCorte = this.finCorte.toISOString();//.slice(0,10) + ' 18:59:59';              
  }

  getCortes(){
    this.adminService.getCortes().subscribe(res => {
      this.cortesFechas = res;
    },(error:any)=> {
      console.log(error)
    });
  }

  onChangeCorte(event:any){
    this.totalPagar=0;
    this.totalGanancia=0;
    this.totalCiber = [];
    this.totalAPagar = [];
    if(event.target.value=='actual'){
      this.cortes= this.inicioCorte.slice(0,10)+this.finCorte.slice(0,10);
      this.getPreciosHistorial(this.cortes);
    }else{
      this.cortes = event.target.value;
      this.getPreciosHistorial(this.cortes);
    }
    
  }

  verCorte(){

    this.totalPagar=0;
    this.totalGanancia=0;
    if(this.result.rol=='admin'){
      this.adminService.getPricesHistorialAdmin(this.result.id, this.cortes.slice(0,10) + ' 00:00:00', this.cortes.slice(10,21)+ ' 18:59:59').subscribe(res => {
        var array:any = res;
        for(var y=0; y<array.length; y++){
          this.totalPagar = this.totalPagar + (array[y].costo - array[y].precioEjecutivo);
          this.totalGanancia = this.totalGanancia + array[y].precioEjecutivo;
        }
        
      },(error:any)=> {
        console.log(error)
      });
    }else if(this.result.rol=='ejecutivo'){
      this.adminService.getPricesHistorial(this.result.id, this.result.idEjecutivo, this.cortes.slice(0,10) + ' 00:00:00', this.cortes.slice(10,21)+ ' 18:59:59').subscribe(res => {
        var array:any = res;
        var ciber = 0;
        var aPagar = 0;
        for(var y=0; y<array.length; y++){
          ciber = ciber + array[y].costo;
          aPagar = aPagar + array[y].precioEjecutivo;
        }
        this.totalPagar = this.totalPagar + aPagar;
        this.totalGanancia = this.totalGanancia + (ciber - aPagar);
      },(error:any)=> {
        console.log(error)
      });
    }
  }
}