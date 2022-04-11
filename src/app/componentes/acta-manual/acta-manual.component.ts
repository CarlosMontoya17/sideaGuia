import { Component, OnInit, OnDestroy } from '@angular/core';
import { PeticionesService } from  'src/app/servicios/peticiones/peticiones.service';
import { AdminService } from 'src/app/servicios/admin/admin.service';
import { WebSocketService } from 'src/app/servicios/websocket/web-socket.service';
import { Router } from  "@angular/router";
import * as CryptoJS from 'crypto-js';
declare function swalOk(mensaje:any): any;
declare function swalError(mensaje:any): any;
declare function validarCurpManual(): any;
declare function validarActoRegistralManual(tipoActa:any): any;
declare function validarPrimeraPersonaManual(entidad:any): any;
declare function validarAmbasPersonasManual(entidad:any): any;
@Component({
  selector: 'app-acta-manual',
  templateUrl: './acta-manual.component.html',
  styleUrls: ['./acta-manual.component.css']
})
export class ActaManualComponent implements OnInit {
  result:any = [];
  tipoBusqueda:any = 'Seleccione el tipo de busqueda';
  entidad:any = 'Entidad de registro';
  entidadValue:any = 0;
  curp:any='';
  actoRegistral:any = 'Seleccione el acto registral';
  nombres:any;
  primerApellido:any;
  segundoApellido:any;
  sexo:any;
  fechaNacimiento:any;
  nombrePersonaDos:any;
  primerApellidoPersonaDos:any;
  segundoApellidoPersonaDos:any;
  preview:any =1;
  parametro:any;
  acto:any;
  bdEstado:any;
  costo:any = 0;
  costoAdmin:any = 0;
  tipoUsuario: any=1;
  usuarios:any = [];
  usuariosCibers:any = [];
  seleccionado:any = [];


  constructor(private adminService: AdminService, private peticionesService: PeticionesService, public  router:  Router, public socketService: WebSocketService) {}

  ngOnInit(): void {
    this.init();
    
  }

  buscar(){
    if(validarCurpManual() && validarActoRegistralManual(this.actoRegistral)){
      this.parametro = this.curp;
      this.proceso();
  
    } 
  }

  buscarDatosPersonales(){
    if(validarPrimeraPersonaManual(this.entidadValue)){
      this.parametro = this.nombres.toUpperCase()+' ' +this.primerApellido.toUpperCase() +' '+ this.segundoApellido.toUpperCase();
      this.proceso();
    }
    
  }

  buscarDatosPersonalesAmbasPersonas(){
    if(validarAmbasPersonasManual(this.entidadValue)){
      this.parametro = this.nombres.toUpperCase()+' ' +this.primerApellido.toUpperCase() +' '+ this.segundoApellido.toUpperCase();
      this.proceso();
    }
  }

  selectEjecutivo(element){
    this.adminService.getUsersByRol('cliente', this.usuarios[element.target.value].id).subscribe(res => {
      this.usuariosCibers = res;
      this.seleccionado = this.usuarios[element.target.value];
    },(error:any)=> {
      swalError("Contacte al departamento de software.");
    });
  }

  selectCliente(element){
    this.seleccionado = this.usuariosCibers[element.target.value];
    this.preview=0;
  }

  getEjecutivos(){
    this.adminService.getUsersByRol('ejecutivo', 14).subscribe(res => {
      this.usuarios = res;
    },(error:any)=> {
      swalError("Contacte al departamento de software.");
    });
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
    this.primerApellido= '';
    this.primerApellidoPersonaDos = '';
    this.segundoApellido = '';
    this.segundoApellidoPersonaDos = '';
    this.nombres = '';
    this.nombrePersonaDos = '';
    this.fechaNacimiento = '';
    this.sexo = '';
  }

  proceso(){
    switch(this.actoRegistral){
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
      
      
      
      this.adminService.getCosto(this.seleccionado.id).subscribe(data => {
        for(var key in data[0].precios){
          if (key == this.bdEstado){
            this.costo = data[0].precios[key];
          }
        }
        this.adminService.getCosto(this.seleccionado.idEjecutivo).subscribe(data2 => {
          for(var key2 in data2[0].precios){
            if (key2 == this.bdEstado){
              this.costoAdmin = data2[0].precios[key2];
            }
          }
          this.adminService.addHistorial(this.seleccionado.id, this.seleccionado.idEjecutivo, this.seleccionado.idAdmin, this.acto, this.costo, this.costoAdmin, this.entidad, this.parametro, null).subscribe(res => {
            swalOk('Acta agregada correctamente');
          },(error:any)=> {
            swalError("Error al agregar el acta, intentalo de nuevo");
          });
        },(error:any) => {
          swalError("Error 300, contacte al departamento de software.");
        });
      },error => {
        swalError("Error 304, contacte al departamento de software!");
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
        if(this.result.accessToken!='' && this.result.rol=='manual'){
          this.adminService.init();
          this.getEjecutivos();
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

}
