import { Component, OnInit, OnDestroy } from '@angular/core';
import { PeticionesService } from  'src/app/servicios/peticiones/peticiones.service';
import { AdminService } from 'src/app/servicios/admin/admin.service';
import { WebSocketService } from 'src/app/servicios/websocket/web-socket.service';
import { Router } from  "@angular/router";
import * as CryptoJS from 'crypto-js';
declare function swalOk(mensaje:any): any;
declare function swalError(mensaje:any): any;
declare function swalErrorWhats(acta:any, dato:any): any;
declare function swalErrorWhatsDP(acta:any,  nombres:any, primerApellido:any, segundoApellido:any, sexo:any, fechaNacimiento:any, entidad:any): any;
declare function swalErrorWhatsDP2(acta:any, nombres:any, primerApellido:any, segundoApellido:any, nombre2:any, primerApellido2:any, segundoApellido2:any, entidad:any): any;
declare function validarCurp(): any;
declare function validarActoRegistral(tipoActa:any): any;
declare function validarPrimeraPersona(entidad:any): any;
declare function validarAmbasPersonas(entidad:any): any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, OnDestroy {
  url:any = 'http://189.129.194.231:81';
  result:any = [];
  pdfSrc:any;
  fecha_actual:any = new Date();
  fecha:any;
  usuario:any = 'Usuario';
  tipoBusqueda:any = 'Seleccione el tipo de busqueda';
  entidad:any = 'Entidad de registro';
  entidadValue:any = 0;
  curp:any='';
  actoRegistral:any = 'Seleccione el acto registral';
  data:any;
  mostrarLoader:any = 0;
  tokenUno:any;
  tokenDos:any;
  nombres:any;
  primerApellido:any;
  segundoApellido:any;
  sexo:any;
  fechaNacimiento:any;
  nombrePersonaDos:any;
  primerApellidoPersonaDos:any;
  segundoApellidoPersonaDos:any;
  preview:any =0;
  parametro:any;
  acto:any;
  bdEstado:any;
  costo:any = 0;
  costoAdmin:any = 0;
  inicioCorte:any;
  finCorte:any;
  sistema:any = 0;


  constructor(private adminService: AdminService, private peticionesService: PeticionesService, public  router:  Router, public socketService: WebSocketService) {}

  ngOnInit(): void {
    this.init();
    this.socketService.onMessage().subscribe((res) => {
      if(res!=null){
        this.tokenUno = res.tokenUno;
        this.tokenDos = res.tokenDos;
        this.sistema = 1;
      }else{
        this.sistema=0;
        this.tokenUno = null;
        this.tokenDos = null;
      }
    });
  }

  ngOnDestroy() {
    if(this.data!=null){
      this.borrarActa(this.parametro+" - "+this.acto);
      this.entidadValue=0;
    } 
  }

  buscar(){
    if(this.sistema==1){
      if(this.result.descargadas <= this.result.limiteActas){
        this.postBuscar();
      }else if(this.result.rol=='admin' || this.result.rol=='ejecutivo'){
        this.postBuscar();
      }else{
        swalError('Has excedido la cantidad de actas permitida, contacta a tu ejecutivo para solicitar más!');
      }
    }else{
      swalError('Actualmente el sistema está fuera de servicio, puedes verificar el estado del sistema en la barra de información');
    }
    
  }

  async postBuscar(){
    switch(this.actoRegistral){
      case "1":{
        this.acto = 'NACIMIENTO';
        break;
      }
      case "2":{
        this.acto = 'DEFUNCION';
        this.bdEstado = 'n33';
        break;
      }
      case "3":{
        this.acto = 'MATRIMONIO';
        this.bdEstado = 'n34';
        break;
      }
      case "4":{
        this.acto = 'DIVORCIO';
        this.bdEstado = 'n35';
        break;
      }
    }
    switch(this.tipoBusqueda){
      case "1":{
        if(validarActoRegistral(this.actoRegistral) && validarCurp()){
          this.mostrarLoader = 1;
          await this.peticionesService.solicitudActaPorCurp(this.tipoBusqueda, this.actoRegistral, this.entidadValue, this.curp.toUpperCase(), this.tokenUno, this.tokenDos).subscribe(res => {
            this.procesoAPI(this.curp.toUpperCase());
          },(error:any) => {
            console.log(error)
            this.mostrarLoader = 0;
            if(this.result.idAdmin==1){
              swalErrorWhats(this.acto, this.curp.toUpperCase());
            }else{
              swalError('El acta no se encuentra en el sistema, puede intentarlo de nuevo');
            }
          });
        }
        break;
      }
      case "3":{
        if(this.acto == 'MATRIMONIO' || this.acto == 'DIVORCIO'){
          this.mostrarLoader = 1;
          if(validarAmbasPersonas(this.entidadValue)){
            await this.peticionesService.solicitudActaPorDP2(this.tipoBusqueda, this.actoRegistral, this.entidadValue, this.nombres.toUpperCase(), this.primerApellido.toUpperCase(), this.segundoApellido.toUpperCase(), this.nombrePersonaDos.toUpperCase(), this.primerApellidoPersonaDos.toUpperCase(), this.segundoApellidoPersonaDos.toUpperCase(), this.tokenUno, this.tokenDos).subscribe(res => {
              this.procesoAPI(this.nombres.toUpperCase()+' '+this.primerApellido.toUpperCase()+' '+this.segundoApellido.toUpperCase());
            },(error:any) => {
              this.mostrarLoader = 0;
              if(this.result.idAdmin==1){
                swalErrorWhatsDP2(this.acto, this.nombres.toUpperCase(), this.primerApellido.toUpperCase(), this.segundoApellido.toUpperCase(), this.nombrePersonaDos.toUpperCase(), this.primerApellidoPersonaDos.toUpperCase(), this.segundoApellidoPersonaDos.toUpperCase(), this.entidad.toUpperCase());
              }else{
                swalError('El acta no se encuentra en el sistema, puede intentarlo de nuevo');
              }
            });
          }
        }else if(validarPrimeraPersona(this.entidadValue)){
          this.mostrarLoader = 1;
          this.fechaNacimiento = this.fechaNacimiento.substring(8,10) +'/' +this.fechaNacimiento.substring(5,7) +'/'+ this.fechaNacimiento.substring(0,4);
          await this.peticionesService.solicitudActaPorDP(this.tipoBusqueda, this.actoRegistral, this.entidadValue, this.nombres.toUpperCase(), this.primerApellido.toUpperCase(), this.segundoApellido.toUpperCase(), this.sexo.toUpperCase(), this.fechaNacimiento, this.tokenUno, this.tokenDos).subscribe(res => {
            this.procesoAPI(this.nombres.toUpperCase()+' '+this.primerApellido.toUpperCase()+' '+this.segundoApellido.toUpperCase());
          },(error:any) => {
            this.mostrarLoader = 0;
            if(this.result.idAdmin==1){
              swalErrorWhatsDP(this.acto, this.nombres.toUpperCase(), this.primerApellido.toUpperCase(), this.segundoApellido.toUpperCase(), this.sexo.toUpperCase(), this.fechaNacimiento.toUpperCase(), this.entidad.toUpperCase());
            }else{
              swalError('El acta no se encuentra en el sistema, puede intentarlo de nuevo');
            }
          });
        }
        break;
      }
    }
  }

  async descargar(){
    swalOk("Acta descargada!");
    var downloadURL = window.URL.createObjectURL(this.data);
    var link = document.createElement('a');
    link.href = downloadURL;
    link.download = this.parametro.toUpperCase()+" - "+this.acto.toUpperCase()+ ".pdf";
    link.click();  
    await this.borrarActa(this.parametro.toUpperCase()+" - "+this.acto.toUpperCase());
    setTimeout(()=>{                          
      location.reload();
    }, 1200);
  }
  async preDescarga(){
    if(this.result.rol=='subcliente'){
      var idAux = this.result.idCliente;
      var idClienteAux = this.result.id;
    }else{
      var idAux = this.result.id;
      var idClienteAux:any = null;
    }
    await this.adminService.incrementActa(idAux, this.acto).subscribe(res => {
      this.result.descargadas = res[0][0][0].descargadas;
      this.adminService.incrementarSaldo(idAux, this.costo).subscribe(res2 => {
        this.result.saldo = res2[0][0][0].saldo;
          this.adminService.getCosto(this.result.idEjecutivo).subscribe(data2 => {
            for(var key2 in data2[0].precios){
              if (key2 == this.bdEstado){
                this.costoAdmin = data2[0].precios[key2];
              }
            }
            this.adminService.addHistorial(idAux, this.result.idEjecutivo, this.result.idAdmin, this.acto, this.costo, this.costoAdmin, this.entidad, this.parametro, idClienteAux).subscribe(res3 => {
              localStorage.removeItem('dist');
              var encrypted = CryptoJS.AES.encrypt(JSON.stringify(this.result), "data");
              localStorage.setItem('dist', encrypted.toString());
              this.descargar();
            },(error:any) => {
              swalError("Error 300, contacte al departamento de software.");
            });
          },(error:any) => {
            swalError("Error 300, contacte al departamento de software.");
          });
      },(error:any) => {
        swalError("Error 302, contacte al departamento de software.");
      });
    },(error:any) => {
      swalError("Error 303, contacte al departamento de software.");
    });
  }

  async procesoAPI(argument:any){  
    if(this.result.rol=='subcliente'){
      var idAux = this.result.idCliente;
    }else{
      var idAux = this.result.id;
    }                       
    this.mostrarLoader = 0;
    this.parametro = argument;
    await this.peticionesService.getActa(this.parametro, this.acto).subscribe(data => {
      this.data = data;
      if(this.result.rol=='admin'){
        this.pdfSrc = this.url + '/getActaImg/' + this.parametro + '/' + this.acto;
        this.preview=1;
      }else{
        this.adminService.getCosto(idAux).subscribe(data2 => {
          for(var key in data2[0].precios){
            if (key == this.bdEstado){
              this.costo = data2[0].precios[key];
            }
          }
          this.pdfSrc = this.url + '/getActaImg/' + this.parametro + '/' + this.acto;
          this.preview=1;
        },
        error => {
          swalError("Error 304, contacte al departamento de software!");
        });
      }
    },
    error => {
      swalError("No se encuentra en el sistema!");
    });
  }


  cancelar(){
    this.borrarActa(this.parametro+" - "+this.acto);
    this.preview = 0;
    this.tipoBusqueda = 'Seleccione el tipo de busqueda';
    this.entidadValue=0;
    this.limpiar();
  }

  onChange(event:any){
    this.tipoBusqueda = event;
  }

  onChangeDatos(param:any ,event:any){
    switch(param){
      case 'nombre':{
        this.nombres = event;
        break;
      }
      case 'primerApellido':{
        this.primerApellido = event;
        break;
      }
      case 'segundoApellido':{
        this.segundoApellido = event;
        break;
      }
      case 'sexo':{
        this.sexo = event;
        break;
      }
      case 'fechaNacimiento':{
        this.fechaNacimiento = event;
        break;
      }
      case 'nombre2':{
        this.nombrePersonaDos = event;
        break;
      }
      case 'primerApellido2':{
        this.primerApellidoPersonaDos = event;
        break;
      }
      case 'segundoApellido2':{
        this.segundoApellidoPersonaDos = event;
        break;
      }
    }
  }

  onChangeTwo(event:any){
    this.actoRegistral = event;
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  borrarActa(acta:any){
    this.peticionesService.deleteActa(acta);
  }

  onChangeEntidad(value:any){
    this.entidadValue = value;
  }
  onChangeCurp(curp:any) {
    if(curp.length == 18){
      this.curp = curp;
      var res = curp.charAt(11) + curp.charAt(12)
      switch(res.toUpperCase()){
        case 'AS':{
          this.entidadValue = 1;
          this.entidad = 'AGUASCALIENTES';
          this.bdEstado = 'n0';
          break;
        }
        case 'BC':{
          this.entidadValue = 2;
          this.entidad = 'BAJA CALIFORNIA';
          this.bdEstado = 'n1';
          break;
        }
        case 'BS':{
          this.entidadValue = 3;
          this.entidad = 'BAJA CALIFORNIA SUR';
          this.bdEstado = 'n2';
          break;
        }
        case 'CC':{
          this.entidadValue = 4;
          this.entidad = 'CAMPECHE';
          this.bdEstado = 'n3';
          break;
        }
        case "CS":{
          this.entidadValue = 7;
          this.entidad = 'CHIAPAS';
          this.bdEstado = 'n4';
          break;
        }
        case 'CH':{
          this.entidadValue = 8;
          this.entidad = 'CHIHUAHUA';
          this.bdEstado = 'n5';
          break;
        }
        case 'DF':{
          this.entidadValue = 9;
          this.entidad = 'DISTRITO FEDERAL';
          this.bdEstado = 'n6';
          break;
        }
        case 'CL':{
          this.entidadValue = 5;
          this.entidad = 'COAHUILA DE ZARAGOZA';
          this.bdEstado = 'n7';
          break;
        }
        case 'CM':{
          this.entidadValue = 6;
          this.entidad = 'COLIMA';
          this.bdEstado = 'n8';
          break;
        }
        case 'DG':{
          this.entidadValue = 10;
          this.entidad = 'DURANGO';
          this.bdEstado = 'n9';
          break;
        }
        case 'GT':{
          this.entidadValue = 11;
          this.entidad = 'GUANAJUATO';
          this.bdEstado = 'n10';
          break;
        }
        case 'GR':{
          this.entidadValue = 12;
          this.entidad = 'GUERRERO';
          this.bdEstado = 'n11';
          break;
        }
        case 'HG':{
          this.entidadValue = 13;
          this.entidad = 'HIDALGO';
          this.bdEstado = 'n12';
          break;
        }
        case 'JC':{
          this.entidadValue = 14;
          this.entidad = 'JALISCO';
          this.bdEstado = 'n13';
          break;
        }
        case 'MC':{
          this.entidadValue = 15;
          this.entidad = 'ESTADO DE MEXICO';
          this.bdEstado = 'n14';
          break;
        }
        case 'MN':{
          this.entidadValue = 16;
          this.entidad = 'MICHOACAN';
          this.bdEstado = 'n15';
          break;
        }
        case 'MS':{
          this.entidadValue = 17;
          this.entidad = 'MORELOS';
          this.bdEstado = 'n16';
          break;
        }
        case 'NT':{
          this.entidadValue = 18;
          this.entidad = 'NAYARIT';
          this.bdEstado = 'n17';
          break;
        }
        case 'NL':{
          this.entidadValue = 19;
          this.entidad = 'NUEVO LEON';
          this.bdEstado = 'n18';
          break;
        }
        case 'OC':{
          this.entidadValue = 20;
          this.entidad = 'OAXACA';
          this.bdEstado = 'n19';
          break;
        }
        case 'PL':{
          this.entidadValue = 21;
          this.entidad = 'PUEBLA';
          this.bdEstado = 'n20';
          break;
        }
        case 'QT':{
          this.entidadValue = 22;
          this.entidad = 'QUERETARO';
          this.bdEstado = 'n21';
          break;
        }
        case 'QR':{
          this.entidadValue = 23;
          this.entidad = 'QUINTANA ROO';
          this.bdEstado = 'n22';
          break;
        }
        case 'SP':{
          this.entidadValue = 24;
          this.entidad = 'SAN LUIS POTOSI';
          this.bdEstado = 'n23';
          break;
        }
        case 'SL':{
          this.entidadValue = 25;
          this.entidad = 'SINALOA';
          this.bdEstado = 'n24';
          break;
        }
        case 'SR':{
          this.entidadValue = 26;
          this.entidad = 'SONORA';
          this.bdEstado = 'n25';
          break;
        }
        case 'TC':{
          this.entidadValue = 27;
          this.entidad = 'TABASCO';
          this.bdEstado = 'n26';
          break;
        }
        case 'TS':{
          this.entidadValue = 28;
          this.entidad = 'TAMAULIPAS';
          this.bdEstado = 'n27';
          break;
        }
        case 'TL':{
          this.entidadValue = 29;
          this.entidad = 'TLAXCALA';
          this.bdEstado = 'n28';
          break;
        }
        case 'VZ':{
          this.entidadValue = 30;
          this.entidad = 'VERACRUZ';
          this.bdEstado = 'n29';
          break;
        }
        case 'YN':{
          this.entidadValue = 31;
          this.entidad = 'YUCATAN';
          this.bdEstado = 'n30';
          break;
        }
        case 'ZS':{
          this.entidadValue = 32;
          this.entidad = 'ZACATECAS';
          this.bdEstado = 'n31';
          break;
        }
        default : {
          this.entidadValue = 39;
          this.entidad = 'NACIDO EN EL EXTRANJERO';
          this.bdEstado = 'n32';
          break;
        }
      }
    }else{
      this.entidad = 'Entidad de registro';
    }
  }

  limpiar(){
    this.actoRegistral = 'Seleccione el acto registral';
    this.curp = '';
    this.entidad = 'Entidad de registro';
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
        if(this.result.accessToken!='' && this.result.rol!='publicidad'){
          this.usuario = this.result.usuario;

          this.adminService.init();
          this.obtenerFechaCorte();
          this.socketService.init();
          if((this.fecha_actual.getMonth() +1) < 10){
            this.fecha = this.fecha_actual.getDate() +"/0"+ (this.fecha_actual.getMonth() +1) +"/"+this.fecha_actual.getFullYear();
          }else{
            this.fecha = this.fecha_actual.getDate() +"/"+ (this.fecha_actual.getMonth() +1) +"/"+this.fecha_actual.getFullYear();
          }
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
  }
}
