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
  login(email: string, pwd: string, ip: string): Observable<any> {
    const loginRequest = { email, pwd, ip };
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

  buscarUsuariosPorNombre(texto: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/buscar?q=${encodeURIComponent(texto)}`);
}
  editarUsuario(id: number, usuario: { nombre: string, descripcion: string, privacidad: boolean }): Observable<any> {
    // El backend espera el nombre SIN prefijo "u/", lo añade él mismo
    const usuarioDTO = {
      nombre: usuario.nombre,
      descripcion: usuario.descripcion,
      privacidad: usuario.privacidad
    };
    return this.http.put(`${this.baseUrl}/${id}`, usuarioDTO);
  }
}
