import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
declare function swalError(mensaje:any): any;
declare function swalOk(mensaje:any): any;
const urlApi = 'https://gruporyc.com.mx:81';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
 httpOptions;
 httpOptions2;
 urlsAdd:any = [];
  constructor(private http: HttpClient) { }
  
  init(){
    if(localStorage.getItem('dist')!=null){
      var decrypted = CryptoJS.AES.decrypt(localStorage.getItem('dist') || '{}', "data");
      var result :any = decrypted.toString(CryptoJS.enc.Utf8);
      var data:any = JSON.parse(result);
    }else{
      var data:any = 'test';
    }

    this.httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token' :  data.accessToken
      })
    };
    this.httpOptions2 = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token' :  data.accessToken,
      }),
      responseType: 'text'
    };
  }

  editUser(data:any){
    return this.http.put(urlApi+'/sidea/api/users/update/'+data[0],{usuario : data[1], telefono: data[2]}, this.httpOptions2)
  }

  editUser2(data:any){
    return this.http.put(urlApi+'/sidea/api/users/update2/'+data.id,{descargadas : data.actas, saldo: data.total, nacimiento : data.nacimiento, defuncion : data.defuncion, matrimonio : data.matrimonio, divorcio : data.divorcio}, this.httpOptions2)
  }

  editPrice(id, data:any){
    return this.http.put(urlApi+'/sidea/api/users/update/'+id,{precios : data}, this.httpOptions2)
  }

  deleteUser(id:any){
    return this.http.delete(urlApi+'/sidea/api/users/delete/'+id, this.httpOptions2)
  }

  changeStatusUser(id:any, status:any){
    return this.http.put(urlApi+'/sidea/api/users/update/'+id,{status : status,}, this.httpOptions2)
  }

  pagoManual(id:any, descontar:any){
    return this.http.put(urlApi+'/sidea/api/users/decrementSaldo/'+id+'/'+descontar, this.httpOptions);
  }

  getCosto(id:any){
    return this.http.get(urlApi+'/sidea/api/users/getPricePerId/'+id, this.httpOptions);
  }

  incrementActa(id:any, acto:any){
    return this.http.put(urlApi+'/sidea/api/users/incrementActa/'+id+'/'+acto, {descargadas:0}, this.httpOptions);
  }

  incrementarSaldo(id:any, costo:any){
    return this.http.put(urlApi+'/sidea/api/users/incrementSaldo/'+id+'/'+costo, {descargadas:0}, this.httpOptions);
  }

  addHistorial(idUsuario:any, idEjecutivo:any, idAdmin:any, tipoActa:any, costo:any, precioEjecutivo:any, estado:any, dato:any, idCliente:any){
    return this.http.post(urlApi+'/sidea/api/historial/create/', {idUsuario, idEjecutivo, idAdmin, tipoActa, costo, precioEjecutivo, estado, dato, idCliente}, this.httpOptions2);
  }

  getHistorial(id:any, d1:any, d2:any){
    return this.http.get(urlApi+'/sidea/api/historial/get/'+id+'/'+d1+'/'+d2, this.httpOptions);
  }

  getHistorialSubcliente(id:any, d1:any, d2:any){
    return this.http.get(urlApi+'/sidea/api/getHistorialSubcliente/get/'+id+'/'+d1+'/'+d2, this.httpOptions);
  }

  getData(id:any){
    return this.http.get(urlApi+'/sidea/api/users/data/'+id, this.httpOptions);
  }

  getUsersByRol(rol:any, idEjecutivo:any){
    return this.http.get(urlApi+'/sidea/api/users/dataByRol/'+rol+'/'+idEjecutivo, this.httpOptions);
  }

  getIdsUsers(id:any){
    return this.http.get(urlApi+'/sidea/api/users/getIdsUsers/'+id, this.httpOptions);
  }

  getCountActas(id:any, idEjecutivo:any, tipoActa:any, fechaUno:any, fechaDos:any){
    return this.http.get(urlApi+'/sidea/api/historial/getCountActas/'+id+'/'+idEjecutivo+'/'+tipoActa+'/'+fechaUno+'/'+fechaDos, this.httpOptions);
  }

  getClientes(id:any){
    return this.http.get(urlApi+'/sidea/api/users/clients/data/'+id, this.httpOptions);
  }

  getPricesHistorial(id:any, idEjecutivo:any, d1:any, d2:any){
    return this.http.get(urlApi+'/sidea/api/historial/getIdPays/'+id+'/'+idEjecutivo+'/'+d1+'/'+d2, this.httpOptions);
  }

  getPricesHistorial2(id:any, idEjecutivo:any, d1:any, d2:any){
    return this.http.get(urlApi+'/sidea/api/historial/getIdPays2/'+id+'/'+idEjecutivo+'/'+d1+'/'+d2, this.httpOptions);
  }

  getPricesHistorialAdmin(idAdmin:any, d1:any, d2:any){
    return this.http.get(urlApi+'/sidea/api/historial/getIdPaysAdmin/'+idAdmin+'/'+d1+'/'+d2, this.httpOptions);
  }

  updateLimiteActas(data:any){
    return this.http.put(urlApi+'/sidea/api/users/update/'+data[0], {limiteActas : data[1]}, this.httpOptions2);
  }

  getCortes(){
    return this.http.get(urlApi+'/sidea/api/dates/get/', this.httpOptions);
  }

  getImages(categoria){
    return this.http.get(urlApi+'/sidea/api/imgs/get/'+categoria, this.httpOptions);
  }

  async addImg(param:any, categoria:any){
    if(param!=null){
      var img;
      let formData = new FormData();
      img = param.name;
      formData.append("uploads[]", param, img);
      await this.uploadFile(formData, '/imgUpload').subscribe((res)=> {
        this.http.post(urlApi+'/sidea/api/imgs/create/', {path: img, categoria : categoria}, this.httpOptions2).subscribe(res => {
          swalOk('Imagen agregada correctamente');
          setTimeout(function(){
            location.reload();
          },1300);
        },error => {
          console.log(error)
          swalError('Error al subir la imagen');
        });
      },error => {
        console.log(error)
        swalError('Error al subir la imagen');
      });
    }
  }

  uploadFile(formData, url) {
    return this.http.post(urlApi+url, formData);
  }


  deleteImg(id:any, path:any){
    return this.http.delete(urlApi+'/sidea/api/imgs/delete/'+id+'/'+path, this.httpOptions2);
  }

  descargarImgs(){
    return this.http.get(urlApi+'/imgs/download/', {responseType: 'blob'});
  }

  async addImgComprobante(id:any, file:any){
    if(file!=null){
      var img;
      let formData = new FormData();
      img = id;
      formData.append("uploads[]", file, img);
      await this.uploadFile(formData, '/imgUploadComprobante').subscribe((res)=> {
        this.http.put(urlApi+'/sidea/api/users/update/'+id, {comprobante : img}, this.httpOptions2).subscribe(res => {
          swalOk('Comprobante agregado correctamente');
        },error => {
          console.log(error)
          swalError('Error al subir el comprobante');
        });
      },error => {
        console.log(error)
        swalError('Error al subir la imagen');
      });
    }
  }

  addSubcliente(idEjecutivo:any, idAdmin:any, data:any, id:any){
    return this.http.post(urlApi+'/sidea/api/auth/signup/', {idEjecutivo: idEjecutivo, idAdmin: idAdmin, usuario : data[0], password: data[1], telefono: data[2], rol: 'subcliente', idCliente: id}, this.httpOptions);
  }
}
