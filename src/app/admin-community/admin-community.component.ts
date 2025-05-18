import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ComunidadesApiService } from '../services/API/comunidades-api.service';
import { ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-admin-community',
  templateUrl: './admin-community.component.html',
  imports: [MatButtonModule,MatPaginator,CommonModule, MatTableModule],
  styleUrls: ['./admin-community.component.scss']
})
export class AdminCommunityComponent implements OnInit {
  usuarios: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['nombre', 'email', 'acciones'];
  comunidadId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private comunidadesApiService: ComunidadesApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.comunidadId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.comunidadesApiService.getUsuariosDeComunidad(this.comunidadId).subscribe({
      next: (usuarios) => {
        // Filtrar al administrador de la lista de usuarios
        const idUsuAdmin = parseInt(this.route.snapshot.queryParamMap.get('idUsuAdmin') || '0');
        this.usuarios.data = usuarios.filter((usuario) => usuario.id !== idUsuAdmin);

        // Configurar paginación y ordenación
        this.usuarios.paginator = this.paginator;
        this.usuarios.sort = this.sort;
      },
      error: (error) => {
        console.error('Error al cargar los usuarios:', error);
      },
    });
  }

  expulsarUsuario(usuarioId: number): void {
    this.comunidadesApiService.abandonarComunidad(usuarioId, this.comunidadId).subscribe({
      next: () => {
        this.usuarios.data = this.usuarios.data.filter((usuario) => usuario.id !== usuarioId);
      },
      error: (error) => {
        console.error('Error al expulsar al usuario:', error);
      },
    });
  }
}
