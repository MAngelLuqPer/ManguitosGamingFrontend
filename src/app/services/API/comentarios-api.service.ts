import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class ComentariosApiService {

  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}
  getData(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }
  getComentariosByPostId(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/comentarios/publicacion/${postId}`);
  }
  createComentario(comentarioDTO: { contenido: string; usuarioId: number; publicacionId: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/comentarios`, comentarioDTO);
  }
  deleteComentario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/comentarios/${id}`);
  }

  responderComentario(comentarioDTO: { contenido: string; usuarioId: number; publicacionId: number; comentarioPadreId?: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/comentarios/responder`, comentarioDTO);
  }
  getRespuestasByComentarioId(comentarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/comentarios/respuestas/${comentarioId}`);
  }
  expulsarUsuario(comunidadId: number, expulsionDTO: { usuarioId: number; razon: string; fechaFin: string }): Observable<any> {
    const endpoint = `${this.baseUrl}/comunidad/${comunidadId}/expulsar`;
    return this.http.post(endpoint, expulsionDTO);
  }
}
