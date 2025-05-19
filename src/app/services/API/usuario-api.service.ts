import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { get } from 'http';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class UsuarioApiService {

  private baseUrl = environment.baseUrl + '/usuario';

  constructor(private http: HttpClient) {}

  // Login de usuario
  login(email: string, pwd: string): Observable<any> {
    const loginRequest = { email, pwd };
    return this.http.post(`${this.baseUrl}/login`, loginRequest);
  }

  // Registrar un nuevo usuario
  register(nombre: string, email:string, descripcion: string, privacidad: boolean, pwd: string): Observable<any> {
    const registerRequest = { nombre, email, descripcion, privacidad, pwd };
    return this.http.put(`${this.baseUrl}`, registerRequest);
  }

  // Eliminar un usuario por ID
  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  getUsuarioById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
