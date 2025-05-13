import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ComentariosApiService {

  private baseUrl = 'http://localhost:8080/proyectofct/api';

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
}
