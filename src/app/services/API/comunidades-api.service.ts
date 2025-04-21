import { Injectable } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunidadesApiService {

  private baseUrl = 'http://localhost:8080/proyectofct';
  constructor(private http: HttpClient) { }
  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }

  getAllComunidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/comunidad`);
  }

  // Método POST
  postData(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data);
  }

  // Método PUT
  updateData(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${endpoint}`, data);
  }

  // Método DELETE
  deleteData(endpoint: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}`);
  }
  
}
