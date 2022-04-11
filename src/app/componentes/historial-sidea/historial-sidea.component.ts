import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AdminService } from 'src/app/servicios/admin/admin.service';
declare function swalOk(mensaje:any): any;
declare function swalError(mensaje:any): any;
@Component({
  selector: 'app-historial-sidea',
  templateUrl: './historial-sidea.component.html',
  styleUrls: ['./historial-sidea.component.css']
})
export class HistorialSideaComponent implements OnInit {
  historialUsuario:any;
  result:any;
  usuario:any;
  inicioCorte:any;
  finCorte:any;
  flag:any='2';
  ejecutivos:any = [];
  clientes:any = [];
  idABuscar:any = -1;
  isEjecutivo = false;
  tipoUsuario: any=1;
  usuarios:any = [];
  usuariosTemp:any = [];
  precios:any = [];
  cibers:any = [];
  isAdmin = false;
  total:any=0;
  cortesFechas:any = [];
  cortes:any = [];
  subcliente=false;


  gridApi:any;
  gridColumnApi:any;
   defaultColDef:any;
   popupParent:any;
   columnDefs:any;
   rowData:any;
  constructor(private adminService: AdminService, public  router:  Router) {
    this.defaultColDef = {
      editable: true,
      resizable: true,
      minWidth: 100,
      flex: 1,
    };
    this.popupParent = document.body;
    this.columnDefs = [
      { headerName: 'Dato', field: 'dato' },
      { headerName: 'Documento', field: 'tipoActa' },
      { headerName: 'Estado', field: 'estado' },
      { headerName: 'Fecha', field: 'createdAt' },
    ];
    this.rowData = [
      {
        dato: '{{data.dato}}',
        costo: '',
        tipoActa: '',
        estado: '',
        createdAt: '',
      },
    ];
   }

  ngOnInit(): void {
  }
  getHistorial(id:any, d1:any, d2:any){
    if(this.result.rol=='subcliente'){
      this.adminService.getHistorialSubcliente(id, d1, d2).subscribe(data => {
        this.historialUsuario = data;
        this.total = this.historialUsuario.reduce((sum, value) => ( sum + Number(value.costo)), 0);
        this.historialUsuario.reverse();
      },error => {
        swalError("Error 600, contacte al departamento de software!");
      });

    }else{
      this.adminService.getHistorial(id, d1, d2).subscribe(data => {
        this.historialUsuario = data;
        this.total = this.historialUsuario.reduce((sum, value) => ( sum + Number(value.costo)), 0);
        this.historialUsuario.reverse();
      },error => {
        swalError("Error 600, contacte al departamento de software!");
      });
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
        if(result.accessToken!='' && this.result.rol!='publicidad'){
          this.obtenerFechaCorte();
          this.adminService.init();
          if(this.result.rol=='admin'){
            this.getEjecutivos();
            this.getClientes();
            this.getCortes();
          }else if(this.result.rol=='ejecutivo'){
            this.getClientes();
            this.getCortes();
          }else if(this.result.rol=='cliente'){
            this.getCortes();
            this.getSubclientes();
          }
        }else if(this.result.rol=='publicidad'){
          this.router.navigate(['/publicidad']);
        }else{
          this.router.navigate(['/login']);
        }
      }else{
        this.router.navigate(['/login']);
      }
    }
  }

  getSubclientes(){
    this.adminService.getUsersByRol('subcliente', this.result.id).subscribe(res => {
      this.usuarios = res;
    },(error:any)=> {
      swalError("Contacte al departamento de software.");
    });
  }
  getEjecutivos(){
    this.adminService.getUsersByRol('ejecutivo', this.result.id).subscribe(res => {
      this.ejecutivos = res;
    },
    (error:any)=> {
      swalError("Contacte al departamento de software!");
    });
  }

  getClientes(){
    this.adminService.getUsersByRol('cliente', this.result.id).subscribe(res => {
      this.clientes = res;
    },
    (error:any)=> {
      swalError("Contacte al departamento de software!");
    });
  }

  getCortes(){
    this.adminService.getCortes().subscribe(res => {
      this.cortesFechas = res;
      this.cortesFechas.reverse();
    },(error:any)=> {
      console.log(error)
    });
  }
  onChangeCortes(event:any){
    if(event.target.value=='actual'){
       this.cortes= this.inicioCorte.slice(0,10)+this.finCorte.slice(0,10);
    }else{
      this.cortes = event.target.value;
    }
  }

  verHistorial(){
    if(this.idABuscar > -1 && this.cortes.length>0){
      if(this.subcliente){
        this.adminService.getHistorialSubcliente(this.idABuscar, this.cortes.slice(0,10) + ' 00:00:00', this.cortes.slice(10,21)+ ' 18:59:59').subscribe(data => {
          this.historialUsuario = data;
          this.total = this.historialUsuario.reduce((sum, value) => ( sum + Number(value.costo)), 0);
          this.historialUsuario.reverse();
        },error => {
          swalError("Error 600, contacte al departamento de software!");
        });
      }else{
        this.adminService.getHistorial(this.idABuscar, this.cortes.slice(0,10) + ' 00:00:00', this.cortes.slice(10,21)+ ' 18:59:59').subscribe(data => {
          this.historialUsuario = data;
          this.total = this.historialUsuario.reduce((sum, value) => ( sum + Number(value.costo)), 0);
          this.historialUsuario.reverse();
        },error => {
          swalError("Error 600, contacte al departamento de software!");
        });
      }
    }
  }

  onChangeEjecutivos(event:any){
    this.idABuscar = event.target.value;
  }

  onChangeEjecutivos2(event:any){
    this.idABuscar = event.target.value;
    this.adminService.getUsersByRol('cliente', this.idABuscar).subscribe(res => {
      this.cibers = res;
    },(error:any)=> {
      swalError("Contacte al departamento de software.");
    });
  }

  onChangeClientes(event:any){
    this.idABuscar = event.target.value;
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
    
    this.inicioCorte = this.inicioCorte.toISOString().slice(0,10) + ' 00:00:00';
    this.finCorte = this.finCorte.toISOString().slice(0,10) + ' 18:59:59';
    this.adminService.init();
    this.getHistorial(this.result.id, this.inicioCorte, this.finCorte);               
  }
  onChangeSubclientes(event){
    if(event.target.value == 'mi'){
      this.idABuscar = this.result.id;
      this.subcliente =false;
    }else{
      this.idABuscar = event.target.value;
      this.subcliente=true;
    }
  }

  onBtnExport() {
    this.gridApi.exportDataAsCsv();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
}
