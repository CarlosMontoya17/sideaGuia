import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const urlApi = 'https://gruporyc.com.mx:81';


const httpOptions = {
  headers : new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class PeticionesService {
  constructor(private http: HttpClient) { }

  solicitudActaPorCurp(tipo:any, acto:any, entidad:any, curp:any, tokenUno:any, tokenDos:any){
    return this.http.post(urlApi+'/petActa/', {tipo, acto, entidad, curp, tokenUno, tokenDos}, {responseType: 'text'});
  }

  solicitudActaPorDP(tipo:any, acto:any, entidad:any, nombres:any, primerApellido:any, segundoApellido:any, sexo:any, fechaNacimiento:any, tokenUno:any, tokenDos:any){
    return this.http.post(urlApi+'/petActa/', {tipo, acto, entidad, nombres, primerApellido, segundoApellido, sexo, fechaNacimiento,  tokenUno, tokenDos}, {responseType: 'text'});
  }

  solicitudActaPorDP2(tipo:any, acto:any, entidad:any, nombres:any, primerApellido:any, segundoApellido:any, nombre2:any, primerApellido2:any, segundoApellido2:any, tokenUno:any, tokenDos:any){
    return this.http.post(urlApi+'/petActa/', {tipo, acto, entidad, ambos: 'on', nombres, primerApellido, segundoApellido, nombre2, primerApellido2, segundoApellido2,  tokenUno, tokenDos}, {responseType: 'text'});
  }

  getActa(param:any, acto:any){
    return this.http.get(urlApi+'/getActa/'+param+'/'+acto, {responseType: 'blob'});
  }

  deleteActa(acta:any){
    this.http.delete(urlApi+'/deleteActa/'+acta).subscribe(data2 => {
              
    },
    error => {
      console.log(error)
    });
  }

}

