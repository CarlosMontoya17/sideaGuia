import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth/auth.service';
import { PeticionesService } from 'src/app/servicios/peticiones/peticiones.service';
import { AdminService } from 'src/app/servicios/admin/admin.service';
import { Router } from  "@angular/router";
import * as CryptoJS from 'crypto-js';

declare function addUserModal(rol:any): any;
declare function editUserModal(usuario:any): any;
declare function deleteUserModal(id:any): any;
declare function changeStatusUserModal(id:any, status:any): any;
declare function pagoManualModal(id:any, idEjecutivo:any): any;
declare function limiteActasModal(id:any, limiteActas:any): any;
declare function swalOk(mensaje:any): any;
declare function swalError(mensaje:any): any;
declare function listadePrecios(id, data:any):any;
declare function comprobante2(comprobante:any): any;
declare function addSubcliente(id:any, idEjecutivo:any);

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  tipoUsuario: any=1;
  result:any;
  usuarios:any = [];
  usuariosTemp:any = [];
  usuario:any;
  precios:any = [];
  isEjecutivo = false;
  clientesSub:any = [];
  inicioCorte:any;
  finCorte:any;

  constructor(private authService: AuthService, private ngZone: NgZone, private peticionesService: PeticionesService, private adminService: AdminService, public  router:  Router) { }

  ngOnInit(): void {
    this.init();
  }

  modalAddUser() {
    if(this.isEjecutivo){
      addUserModal(1);
    }else{
      addUserModal(0);
    }
  }

  modalEditar(usuario:any){
    editUserModal(usuario);
  }

  modalEliminar(id:any){
    deleteUserModal(id);
  }

  modalCambiarStatus(id:any, status:any){
    changeStatusUserModal(id, status);
  }

  modalListadePrecios(id:any){
    this.adminService.getCosto(id).subscribe(res => {
      listadePrecios(id, res[0]);
    },(error:any)=> {
      swalError("Contacte al departamento de software.");
    });
  }

  modalPagoManual(id:any, idEjecutivo:any){
    pagoManualModal(id, idEjecutivo);
  }

  modalLimiteActas(id:any, limiteActas:any){
    limiteActasModal(id, limiteActas);
  }

  pagoManual(id:any, idEjecutivo:any, data2:any){
    var actas;
    var nacimiento;
    var defuncion;
    var matrimonio;
    var divorcio;
    var total;
    this.adminService.pagoManual(id, data2[0]).subscribe(res8 => {
      var temp = res8;
      console.log(temp[0][0][0].saldo)
      this.adminService.getCountActas(id, idEjecutivo, null, this.inicioCorte, this.finCorte).subscribe(res => {
        actas= res;
        this.adminService.getCountActas(id, idEjecutivo, 'NACIMIENTO', this.inicioCorte, this.finCorte).subscribe(res2 => {
          nacimiento= res2;
          this.adminService.getCountActas(id, idEjecutivo, 'DEFUNCION', this.inicioCorte, this.finCorte).subscribe(res3 => {
            defuncion= res3;
            this.adminService.getCountActas(id, idEjecutivo, 'MATRIMONIO', this.inicioCorte, this.finCorte).subscribe(res4 => {
              matrimonio= res4;
              this.adminService.getCountActas(id, idEjecutivo, 'DIVORCIO', this.inicioCorte, this.finCorte).subscribe(res5 => {
                divorcio= res5;
                this.adminService.getCountActas(id, idEjecutivo, 'total', this.inicioCorte, this.finCorte).subscribe(res6 => {
                  total = res6;
                  total = total.reduce((sum, value) => ( sum + Number(value.costo)), 0);
                  total = total + temp[0][0][0].saldo;
                  var data = {id, actas, nacimiento, defuncion, matrimonio, divorcio, total};
                  this.adminService.editUser2(data).subscribe(res => {
                    swalOk("Cambios guardados exitosamente");
                    setTimeout(function(){
                      location.reload();
                    },1000);
                  },(error:any)=> {
                    console.log(error)
                    swalError("Error, contacte al departamento de software1.");
                  });
                },(error: any) => {
                  swalError("Error, contacte al departamento de software2.");
                });              
              },(error: any) => {
                swalError("Error, contacte al departamento de software3.");
              });
            },(error: any) => {
              swalError("Error, contacte al departamento de software4.");
            });
          },(error: any) => {
            swalError("Error, contacte al departamento de software5.");
          });
        },(error: any) => {
          swalError("Error, contacte al departamento de software6.");
        });
      },(error: any) => {
        swalError("Error, contacte al departamento de software7.");
      });
    },(error: any) => {
      console.log(error)
      swalError("Error, contacte al departamento de software8.");
    });
  }

  async addUser(data: any) {
    var idTemp;
    var idAdminTemp;
    if(this.result.rol == 'admin'){
      idTemp = this.result.id;
      idAdminTemp = this.result.id;
    }else if(this.result.rol == 'ejecutivo'){
      idTemp = this.result.id;
      idAdminTemp = this.result.idAdmin;
    }
    await this.authService.register(data, idTemp, idAdminTemp, this.result.accessToken).subscribe(res => {
      swalOk("Usuario agregado");
      location.reload();
    },
    (error: any) => {
      console.log(error)
      swalError("Contacte al departamento de software.");
    });
  }

  limiteActas(data:any){
    this.adminService.updateLimiteActas(data).subscribe(res => {
      swalOk("Cambios guardados exitosamente");
      setTimeout(function(){
        location.reload();
      },1000);
    },
    (error:any)=> {
      swalError("Error, contacte al departamento de software.");
    });
  }

  editUser(data:any){
    this.adminService.editUser(data).subscribe(res => {
      swalOk("Cambios guardados exitosamente");
      setTimeout(function(){
        location.reload();
      },1000);
    },
    (error:any)=> {
      swalError("Error, contacte al departamento de software.");
    });
  }

  editPrice(id, data:any, json:any){
    var cont=0;
    for (var key in json.precios) {
      json.precios[key] = data[cont]
      cont++;
    }
    this.adminService.editPrice(id, json.precios).subscribe(res => {
      swalOk("Cambios guardados exitosamente");
      setTimeout(function(){
        location.reload();
      },1000);
    },(error:any)=> {
      swalError("Error, contacte al departamento de software.");
    });  
  }

  deleteUser(id:any){
    this.adminService.deleteUser(id).subscribe(res => {
      swalOk("Usuario eliminado exitosamente");
      setTimeout(function(){
        location.reload();
      },1000);
    },
    (error:any)=> {
      swalError("Error, contacte al departamento de software.");
    });
  }

  changeStatusUser(id:any, status:any){
    this.adminService.changeStatusUser(id, status).subscribe(res => {
      swalOk("Status modificado");
      setTimeout(function(){
        location.reload();
      },1000);
    },
    (error:any)=> {
      swalError("Error, contacte al departamento de software.");
    });
  }

  onChange(event: any) {
    this.tipoUsuario = event;
  }

  async cambiarTabla(id:any){
    switch(id){
      case 1:{
        await this.adminService.getUsersByRol('ejecutivo', this.result.id).subscribe(res => {
          this.usuarios = res;
          this.tipoUsuario=id;
        },(error:any)=> {
          swalError("Contacte al departamento de software.");
        });
        break;
      }
      case 2:{
        this.usuarios = [];
        if(this.result.rol == 'admin'){
          await this.adminService.getUsersByRol('ejecutivo', this.result.id).subscribe(res => {
            this.usuariosTemp = res;
            this.tipoUsuario=id;
          },(error:any)=> {
            swalError("Contacte al departamento de software.");
          });
        }else if(this.result.rol == 'ejecutivo'){
          await this.adminService.getUsersByRol('cliente', this.result.id).subscribe(res => {
            this.usuarios = res;
            this.tipoUsuario=id;
          },(error:any)=> {
            swalError("Contacte al departamento de software.");
          });
        }
        break;
      }
      case 3:{
        this.usuarios = [];
        if(this.result.rol == 'admin'){
          await this.adminService.getUsersByRol('ejecutivo', this.result.id).subscribe(res => {
            this.usuariosTemp = res;
            this.tipoUsuario=id;
          },(error:any)=> {
            swalError("Contacte al departamento de software.");
          });
        }else if(this.result.rol == 'ejecutivo'){
          await this.adminService.getUsersByRol('cliente', this.result.id).subscribe(res => {
            this.usuariosTemp = res;
            this.tipoUsuario=id;
          },(error:any)=> {
            swalError("Contacte al departamento de software.");
          });
        }
        break;
      }
    }
  }



  init(){
    window['angularComponentReferenceAdd'] = { component: this, zone: this.ngZone, loadAngularFunction: (data: any) => this.addUser(data)};
    window['angularComponentReferenceEdit'] = { component: this, zone: this.ngZone, loadAngularFunction: (data: any) => this.editUser(data)};
    window['angularComponentReferenceDelete'] = { component: this, zone: this.ngZone, loadAngularFunction: (id: any) => this.deleteUser(id)};
    window['angularComponentReferenceChangeStatus'] = { component: this, zone: this.ngZone, loadAngularFunction: (id: any, status:any) => this.changeStatusUser(id, status)};
    window['angularComponentReferencePagoManual'] = { component: this, zone: this.ngZone, loadAngularFunction: (id: any, idEjecutivo:any, data:any) => this.pagoManual(id, idEjecutivo, data)};
    window['angularComponentReferenceLimiteActas'] = { component: this, zone: this.ngZone, loadAngularFunction: (data: any) => this.limiteActas(data)};
    window['angularComponentReferenceListaPrecios'] = { component: this, zone: this.ngZone, loadAngularFunction: (id:any, data: any, json:any) => this.editPrice(id, data, json)};
    window['angularComponentReferenceAddSubCliente'] = { component: this, zone: this.ngZone, loadAngularFunction: (data: any, id:any, idEjecutivo:any) => this.addSubcliente(data, id, idEjecutivo)};
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
        if(this.result.accessToken!=''  && this.result.rol!='publicidad'){
          if(this.result.rol != 'cliente'){
            this.usuario = this.result.username;
            this.adminService.init();
            this.obtenerFechaCorte();
            if(this.result.rol=='ejecutivo'){
              this.isEjecutivo=true;
              this.cambiarTabla(2);
            }else{
              this.cambiarTabla(1);
            }
          }else{
            this.router.navigate(['/inicio']);
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

  selectEjecutivo(element){
    this.adminService.getUsersByRol('cliente', element.target.value).subscribe(res => {
      this.usuarios = res;
    },(error:any)=> {
      swalError("Contacte al departamento de software.");
    });
  }
  selectEjecutivoSub(element){
    this.adminService.getUsersByRol('cliente', element.target.value).subscribe(res => {
      this.clientesSub = res;
    },(error:any)=> {
      swalError("Contacte al departamento de software.");
    });
  }
  selectEjecutivoSubCliente(element){
    this.adminService.getUsersByRol('subcliente', element.target.value).subscribe(res => {
      this.usuarios = res;
    },(error:any)=> {
      swalError("Contacte al departamento de software.");
    });
  }

  verComprobante(comprobante:any){
    comprobante2(comprobante);
  }

  modalSubcliente(id:any, idEjecutivo:any){
    addSubcliente(id, idEjecutivo);
  }

  addSubcliente(data:any, id:any, idEjecutivo:any){
    this.adminService.addSubcliente(idEjecutivo, this.result.idAdmin, data, id).subscribe(res => {
      swalOk("Usuario agregado");
      location.reload();
    },(error:any)=> {
      swalError("Contacte al departamento de software.");
    });
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
  }
}
