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
import { ReportesApiService } from '../services/API/reportes-api.service'; // Importar el servicio de reportes
import { RouterLink } from '@angular/router';
import { PostsApiService } from '../services/API/posts-api.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import {  MatCard, MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EditFechaExpulsionModalComponent } from './modals/edit-fecha-expulsion-modal/edit-fecha-expulsion-modal.component';
@Component({
  selector: 'app-admin-community',
  templateUrl: './admin-community.component.html',
  imports: [MatCardModule,MatSnackBarModule,RouterLink,MatInputModule,MatFormFieldModule,MatButtonModule,MatPaginator,CommonModule, MatTableModule],
  styleUrls: ['./admin-community.component.scss']
})
export class AdminCommunityComponent implements OnInit {
  usuarios: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  reportes: MatTableDataSource<any> = new MatTableDataSource<any>([]); // Nueva propiedad para los reportes
  displayedColumns: string[] = ['nombre', 'email', 'acciones'];
  displayedColumnsReportes: string[] = ['fecha', 'motivo', 'acciones']; // Columnas para la tabla de reportes
  comunidadId!: number;
  expulsados: any[] = [];

  @ViewChild('usuariosPaginator') usuariosPaginator!: MatPaginator;
  @ViewChild('reportesPaginator') reportesPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private comunidadesApiService: ComunidadesApiService,
    private reportesApiService: ReportesApiService, // Inyectar el servicio de reportes
    private route: ActivatedRoute,
    private dialog: MatDialog, // Inyectar MatDialog
    private postApiService: PostsApiService,
    private snackBar: MatSnackBar, // Inyectar MatSnackBar
    private router: Router // Inyectar Router
  ) {}

  ngOnInit(): void {
    this.comunidadId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    this.cargarUsuarios();
    this.cargarReportes();
    this.cargarExpulsados();

    // Suscribirse para ejecutar la limpieza
    this.comunidadesApiService.limpiarExpulsionesVencidas().subscribe({
      next: (res) => {
        this.cargarExpulsados(); 
      },
      error: (err) => {
        console.error('Error al limpiar expulsiones vencidas:', err);
      }
    });

    this.usuarios.filterPredicate = (data: any, filter: string) => {
      return data.nombre.toLowerCase().includes(filter);
    };
  }

  aplicarFiltro(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value;
    this.usuarios.filter = filtro.trim().toLowerCase();
  }

  cargarUsuarios(): void {
    this.comunidadesApiService.getUsuariosDeComunidad(this.comunidadId).subscribe({
      next: (usuarios) => {
        const idUsuAdmin = parseInt(this.route.snapshot.queryParamMap.get('idUsuAdmin') || '0');
        this.usuarios.data = usuarios.filter((usuario) => usuario.id !== idUsuAdmin);

        this.usuarios.paginator = this.usuariosPaginator;
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
  
  cargarReportes(): void {
    this.reportesApiService.getReportesPorComunidad(this.comunidadId).subscribe({
      next: (reportes) => {
        // Limpiar el formato de fecha y convertir a Date
        this.reportes.data = reportes.map((reporte) => ({
          ...reporte,
          fechaReporte: new Date(reporte.fechaReporte.replace(/\[.*?\]/g, '')) // Eliminar [UTC] y convertir a Date
        }));
        this.reportes.paginator = this.reportesPaginator;
      },
      error: (error) => {
        console.error('Error al cargar los reportes:', error);
      },
    });
  }

  borrarPublicacion(publicacionId: number): void {
    const id = publicacionId;
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la publicación de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('ID de la publicación a borrar:', publicacionId);
        this.postApiService.deleteData(id).subscribe({
          next: () => {
            this.snackBar.open('Publicación borrada con éxito', 'Cerrar', {
              duration: 2000,
            });
            this.cargarUsuarios();
            this.cargarReportes();
          },
          error: (error) => {
            console.error('Error al borrar la publicación:', error);
            this.snackBar.open('Error al borrar la publicación', 'Cerrar', {
              duration: 2000,
            });
          },
        });
      }
    });
  }
    editarComunidad(): void {
    this.router.navigate(['/comunidad/editar', this.comunidadId]);
  }

  scrollTo(section: string): void {
  const el = document.getElementById(section);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
  borrarReporte(reporteId: number): void {
    const id = reporteId;
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el reporte de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('ID del reporte a borrar:', reporteId);
        this.reportesApiService.deleteData(id).subscribe({
          next: () => {
            this.snackBar.open('Reporte borrado con éxito', 'Cerrar', {
              duration: 2000,
            });
            this.cargarReportes();
          },
          error: (error) => {
            console.error('Error al borrar el reporte:', error);
            this.snackBar.open('Error al borrar el reporte', 'Cerrar', {
              duration: 2000,
            });
          },
        });
      }
    });
  }

  // --- Expulsiones ---
  cargarExpulsados(): void {
    this.comunidadesApiService.getUsuariosExpulsados(this.comunidadId).subscribe({
      next: (expulsados) => {
        // Limpiar el sufijo [UTC] de todas las fechas
        this.expulsados = expulsados.map((exp: any) => ({
          ...exp,
          fechaFin: exp.fechaFin ? exp.fechaFin.replace('[UTC]', '') : null
        }));
      },
      error: (error) => {
        console.error('Error al cargar los expulsados:', error);
      }
    });
  }

  borrarExpulsion(expulsado: any): void {
    Swal.fire({
      title: '¿Eliminar expulsión?',
      text: `¿Seguro que quieres eliminar la expulsión de ${expulsado.usuarioNombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.comunidadesApiService.eliminarExpulsion(expulsado.id).subscribe({
          next: () => {
            this.snackBar.open('Expulsión eliminada', 'Cerrar', { duration: 2000 });
            this.cargarExpulsados();
          },
          error: (error) => {
            console.error('Error al eliminar expulsión:', error);
            this.snackBar.open('Error al eliminar expulsión', 'Cerrar', { duration: 2000 });
          }
        });
      }
    });
  }

  expulsadoSeleccionado: any = null;
  nuevaFechaExpulsion: string = '';

  abrirModalFecha(expulsado: any) {
    const dialogRef = this.dialog.open(EditFechaExpulsionModalComponent, {
      data: { fechaFin: expulsado.fechaFin }
    });

    dialogRef.afterClosed().subscribe(nuevaFecha => {
      if (nuevaFecha) {
        this.cambiarFechaExpulsion(expulsado, nuevaFecha);
      }
    });
  }

  cerrarModalFecha() {
    this.expulsadoSeleccionado = null;
    this.nuevaFechaExpulsion = '';
  }

  confirmarCambioFecha() {
    if (this.expulsadoSeleccionado && this.nuevaFechaExpulsion) {
      this.cambiarFechaExpulsion(this.expulsadoSeleccionado, this.nuevaFechaExpulsion);
      this.cerrarModalFecha();
    }
  }
  borrarComunidad(id: any)
  {
    console.log('ID de la comunidad a borrar:', id);
    Swal.fire({
      title: '¿Eliminar comunidad?',
      text: 'Esta acción eliminará la comunidad de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.comunidadesApiService.borrarComunidad(id).subscribe({
          next: () => {
            this.snackBar.open('Comunidad eliminada con éxito', 'Cerrar', { duration: 2000 });
            this.router.navigate(['/comunidades']);
          },
          error: (error) => {
            console.error('Error al eliminar la comunidad:', error);
            this.snackBar.open('Error al eliminar la comunidad', 'Cerrar', { duration: 2000 });
          }
        });
      }
    });
  }

  cambiarFechaExpulsion(expulsado: any, nuevaFecha: string): void {
    this.comunidadesApiService.cambiarFechaExpulsion(expulsado.id, nuevaFecha).subscribe({
      next: () => {
        this.snackBar.open('Fecha de expulsión actualizada', 'Cerrar', { duration: 2000 });
        this.cargarExpulsados();
      },
      error: (error) => {
        console.error('Error al cambiar fecha de expulsión:', error);
        this.snackBar.open('Error al cambiar fecha', 'Cerrar', { duration: 2000 });
      }
    });
  }
}
