import { Injectable } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ComunidadesApiService {

  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }
  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }

  getAllComunidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/comunidad`);
  }

  getPostsByComunidadId(comunidadId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/publicacion/comunidad/${comunidadId}/posts`);
  }
  
  getComunidadById(comunidadId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/comunidad/${comunidadId}`);
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

  joinComunidad(usuarioId: number, comunidadId: string) {
    const endpoint = `${this.baseUrl}/comunidad/unir`;
    const unionDTO = {
      usuarioId: usuarioId,
      comunidadId: comunidadId
    };
    
    console.log('Unión DTO:', unionDTO); // Verifica el contenido de unionDTO
    return this.http.post(endpoint, unionDTO);
  }
  
  perteneceAComunidad(comunidadId: number, usuarioId: number): Observable<{ pertenece: boolean }> {
    const endpoint = `${this.baseUrl}/comunidad/${comunidadId}/pertenece/${usuarioId}`;
    return this.http.get<{ pertenece: boolean }>(endpoint);
  }

  abandonarComunidad(usuarioId: number, comunidadId: number): Observable<any> {
    const endpoint = `${this.baseUrl}/comunidad/${comunidadId}/salir/${usuarioId}`;
    return this.http.delete(endpoint);
  }

  crearComunidad(comunidad: any): Observable<any> {
    const endpoint = `${this.baseUrl}/comunidad`;
    return this.http.post(endpoint, comunidad);
  }

  getIds(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/comunidad/ids`);
  }
  getUsuariosDeComunidad(comunidadId: number): Observable<any[]> {
    const endpoint = `${this.baseUrl}/comunidad/${comunidadId}/usuarios`;
    return this.http.get<any[]>(endpoint);
  }

  expulsarUsuario(comunidadId: number, expulsionDTO: { usuarioId: number; adminId: number; razon: string; fechaFin: string }): Observable<any> {
    const endpoint = `${this.baseUrl}/comunidad/${comunidadId}/expulsar`;
    return this.http.post(endpoint, expulsionDTO);
  }

  buscarComunidadesPorNombre(texto: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/comunidad/buscar?q=${encodeURIComponent(texto)}`);
  }
  getComunidadesDeUsuario(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/comunidad/usuario/${userId}`);
}
getComunidadesCreadasPorUsuario(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/comunidad/admin/${userId}`);
}
}
