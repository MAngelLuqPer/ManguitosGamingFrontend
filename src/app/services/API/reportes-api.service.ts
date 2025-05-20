import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReportesApiService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Función para crear un reporte
  createReporte(reporteDTO: { motivo: string; usuarioId: number; publicacionId?: number; comunidadId?: number }): Observable<any> {
    const endpoint = `${this.baseUrl}/reportes`;
    return this.http.post(endpoint, reporteDTO);
  }
}
