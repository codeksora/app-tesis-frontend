import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    private http: HttpClient
  ) { }

  getAllHospitalMapa(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/hospitals/hospitalMapa`)
  }

  getAllHospitalByParams(body?): Observable<any> {
    return this.http.get(`${environment.apiUrl}/hospitals/hospital`, {
      params: body
    })
  }

  getHospitalByIpress(ipress): Observable<any> {
    return this.http.get(`${environment.apiUrl}/hospitals/hospital/${ipress}`)
  }

  getAllInstitucionByUbigeo(ubigeo): Observable<any> {
    return this.http.get(`${environment.apiUrl}/hospitals/institucion/${ubigeo}`)
  }
}
