import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

const urlApi = 'https://gruporyc.com.mx:81';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username:any, password:any){
    return this.http.post(urlApi+'/sidea/api/auth/signin/', {usuario : username, password: password});
  }

  register(data, id, idAdmin, token:any){
    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token' :  token
      })
    };
    return this.http.post(urlApi+'/sidea/api/auth/signup/', {idEjecutivo: id, idAdmin: idAdmin, usuario : data[0], password: data[1], telefono: data[2], rol: data[3]}, httpOptions);
  }
}