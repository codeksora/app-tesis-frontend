import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DistritosService {

  constructor(
    private http: HttpClient
  ) { }

  getAllUbigeoDistrito(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/ubigeos/distritos`)
  }

//   getHospitalByIpress(ipress): Observable<any> {
//     return this.http.get(`${environment.apiUrl}/hospital/${ipress}`)
//   }
}
