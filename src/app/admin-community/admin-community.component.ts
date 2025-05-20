import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ComunidadesApiService } from '../services/API/comunidades-api.service';
import { ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { KickUserComponent } from './modals/kick-user/kick-user.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-admin-community',
  templateUrl: './admin-community.component.html',
  imports: [MatInputModule,MatFormFieldModule,MatButtonModule,MatPaginator,CommonModule, MatTableModule],
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
    private route: ActivatedRoute,
    private dialog: MatDialog // Inyectar MatDialog
  ) {}

  ngOnInit(): void {
    this.comunidadId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    this.cargarUsuarios();

  // Configurar el filtro para que busque por nombre
    this.usuarios.filterPredicate = (data: any, filter: string) => {
      return data.nombre.toLowerCase().includes(filter);
    };
  }

  aplicarFiltro(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value;
    this.usuarios.filter = filtro.trim().toLowerCase(); // Aplicar filtro en minúsculas y sin espacios
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

  expulsarUsuario(usuario: any): void {
    const idUsuAdmin = parseInt(this.route.snapshot.queryParamMap.get('idUsuAdmin') || '0');
    const dialogRef = this.dialog.open(KickUserComponent, {
      width: '400px',
      data: {
        comunidadId: this.comunidadId,
        nombre: usuario.nombre,
        usuarioId: usuario.id, // Pasar el ID del usuario al modal
        adminId: idUsuAdmin // Pasar el ID del administrador al modal
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Motivo:', result.motivo);
        console.log('Fecha de expulsión:', result.fecha);
        console.log('ID del usuario expulsado:', usuario.id);
        this.cargarUsuarios();
      }
    });
  }
}
