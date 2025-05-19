import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class PostsApiService {

  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }
  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }

  createPublicacion(publiDTO: { titulo: string; contenido: string; usuarioId: number; comunidadId: number }): Observable<any> {
    const endpoint = 'publicacion';
    return this.http.post(`${this.baseUrl}/${endpoint}`, publiDTO);
  }
  
  // getAllComunidades(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/comunidad`);
  // }

  // getPostsByComunidadId(comunidadId: string): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/publicacion/comunidad/${comunidadId}/posts`);
  // }
  
  // getComunidadById(comunidadId: string): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/comunidad/${comunidadId}`);
  // }

  // // Método POST
  // postData(endpoint: string, data: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/${endpoint}`, data);
  // }

  // // Método PUT
  // updateData(endpoint: string, data: any): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/${endpoint}`, data);
  // }

  // Método DELETE
  deleteData(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/publicacion/${id}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/publicacion/${id}`);
  }
  
}
