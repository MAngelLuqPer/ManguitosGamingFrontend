import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioApiService } from '../services/API/usuario-api.service';
import { PostsApiService } from '../services/API/posts-api.service';
import { ComunidadesApiService } from '../services/API/comunidades-api.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportPostComponent } from '../main-view-community/modals/report-post/report-post.component';
import { MatDialog } from '@angular/material/dialog';
import { ReportesApiService } from '../services/API/reportes-api.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.component.html',
  styleUrl: './view-user-profile.component.scss',
  imports: [MatIconModule, CommonModule, MatCardModule, RouterLink, MatButton]
})
export class ViewUserProfileComponent implements OnInit {
  usuario: any = null;
  usuarioLogado: any = null;
  publicaciones: any[] = [];
  comunidadesMap: { [key: number]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private usuariosApiService: UsuarioApiService,
    private postsApiService: PostsApiService,
    private comunidadesApiService: ComunidadesApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private reportesApiService: ReportesApiService
  ) {}

  ngOnInit(): void {
    this.usuarioLogado = JSON.parse(localStorage.getItem('usuario') || 'null');
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cargarUsuario(+id);
      }
    });
  }

  reportarPost(postId: number, comunidadId: number, event: Event): void {
    event.stopPropagation(); // Evitar que el clic navegue al detalle de la publicación

    const dialogRef = this.dialog.open(ReportPostComponent, {
      width: '400px',
      data: {
        usuarioId: this.usuarioLogado.id,
        publicacionId: postId,
        comunidadId: comunidadId
      }
    });


    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reportesApiService.createReporte(result).subscribe({
          next: () => {
            this.snackBar.open('El reporte ha sido enviado con éxito.', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            this.snackBar.open('Hubo un error al enviar el reporte. Inténtalo de nuevo.', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        this.snackBar.open('El reporte fue cancelado.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  borrarPost(postId: number, event: Event): void {
    event.stopPropagation(); // Detener la propagación del evento de clic

    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará la publicación de forma permanente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            this.postsApiService.deleteData(postId).subscribe({
                next: () => {
                    this.snackBar.open('Publicación eliminada con éxito.', 'Cerrar', { duration: 3000 });
                    this.loadPosts(); // Recargar las publicaciones después de eliminar
                },
                error: (err) => {
                    console.error('Error al eliminar la publicación:', err);
                    this.snackBar.open('Hubo un problema al eliminar la publicación.', 'Cerrar', { duration: 3000 });
                },
            });
        }
    });
  }

  cargarUsuario(id: number) {
    this.usuariosApiService.getUsuarioById(id).subscribe(usuario => {
      // Limpia el sufijo [UTC] de la fecha de creación
      if (usuario && usuario.fechaCreacion) {
        usuario.fechaCreacion = usuario.fechaCreacion.replace('[UTC]', '');
      }
      this.usuario = usuario;
      if (
        usuario &&
        (usuario.privacidad === false || this.usuarioLogado?.id === usuario.id)
      ) {
        this.comunidadesApiService.getAllComunidades().subscribe(comunidades => {
          comunidades.forEach((c: any) => {
            this.comunidadesMap[c.id] = c.nombre;
          });
          this.postsApiService.getPublicacionesByUsuario(usuario.id).subscribe(posts => {
            this.publicaciones = posts.map((post: any) => ({
              ...post,
              fechaPublicacion: post.fechaPublicacion
                ? post.fechaPublicacion.replace('[UTC]', '')
                : post.fechaPublicacion,
              comunidadNombre: this.comunidadesMap[post.comunidadId] || 'Desconocida'
            }));
          });
        });
      } else {
        this.publicaciones = [];
      }
    });
  }

  loadPosts() {
    if (
      this.usuario &&
      (this.usuario.privacidad === false || this.usuarioLogado?.id === this.usuario.id)
    ) {
      this.comunidadesApiService.getAllComunidades().subscribe(comunidades => {
        comunidades.forEach((c: any) => {
          this.comunidadesMap[c.id] = c.nombre;
        });
        this.postsApiService.getPublicacionesByUsuario(this.usuario.id).subscribe(posts => {
          this.publicaciones = posts.map((post: any) => ({
            ...post,
            fechaPublicacion: post.fechaPublicacion
              ? post.fechaPublicacion.replace('[UTC]', '')
              : post.fechaPublicacion,
            comunidadNombre: this.comunidadesMap[post.comunidadId] || 'Desconocida'
          }));
        });
      });
    }
  }
}
