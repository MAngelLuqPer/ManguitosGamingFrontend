import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ComunidadesApiService } from '../services/API/comunidades-api.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PostsApiService } from '../services/API/posts-api.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioApiService } from '../services/API/usuario-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReportPostComponent } from './modals/report-post/report-post.component';
import { ReportesApiService } from '../services/API/reportes-api.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommunityEventsService } from '../services/community-events.service';
@Component({
  selector: 'app-main-view-community',
  imports: [MatSelectModule,MatInputModule,MatFormFieldModule,FormsModule,RouterLink, MatButtonModule, MatIconModule, MatCardModule, CommonModule],
  templateUrl: './main-view-community.component.html',
  styleUrl: './main-view-community.component.scss'
})
export class MainViewCommunityComponent implements OnInit {
  usuarioLogado: any = null; 
  comunidadId!: string;
  comunidad: any;
  posts: any[] = [];
  pertenece: boolean | null = null;
  ordenSeleccionado: string = 'votos';
  expulsado: boolean = false;
  fechaFinExpulsion: Date | null = null;
  motivoExpulsion: string | null = null;

  constructor(private route: ActivatedRoute, private ComunidadesApiService: ComunidadesApiService, private router: Router, private PostApiService: PostsApiService, private usuarioApiService: UsuarioApiService,private reportesApiService: ReportesApiService, private snackBar: MatSnackBar, private dialog: MatDialog, public c: CommunityEventsService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        this.usuarioLogado = JSON.parse(usuario);
      }
    }

    this.route.paramMap.subscribe((params) => {
      this.comunidadId = params.get('id')!;
      this.loadComunidad();
      this.loadPosts();
      this.verificarPertenencia();
      this.loadExpulsados(); // <--- Añade esto
    });
  }

  ordenarPosts(): void {
    console.log('Orden seleccionado:', this.ordenSeleccionado);
    if (this.ordenSeleccionado === 'fecha') {
      this.posts.sort((a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime());
    } else if (this.ordenSeleccionado === 'votos') {
      this.posts.sort((a, b) => (b.numVotos || 0) - (a.numVotos || 0));
    }
  }

  loadPosts(): void {
    if (this.expulsado) {
      this.posts = [];
      return;
    }
    this.ComunidadesApiService.getPostsByComunidadId(this.comunidadId).subscribe({
      next: (data) => {
        this.posts = data.map((post) => ({
          ...post,
          fechaPublicacion: new Date(post.fechaPublicacion.replace('[UTC]', '')), // Convertir a objeto Date
        }));
        console.log('Publicaciones cargadas:', this.posts);
        // Ordenar las publicaciones de más reciente a menos reciente
        this.posts.sort((a, b) => b.fechaPublicacion.getTime() - a.fechaPublicacion.getTime());

        // Obtener el nombre del usuario para cada publicación
        this.posts.forEach((post) => {
          this.usuarioApiService.getUsuarioById(post.usuarioId).subscribe({
            next: (usuario) => {
              post.usuarioNombre = usuario.nombre; // Agregar el nombre del usuario a la publicación
            },
            error: (err) => {
              console.error(`Error al cargar el usuario para la publicación con ID ${post.id}:`, err);
            },
          });
        });

        this.ordenarPosts();

        if (this.posts.length === 0) {
          console.log('No se encontraron publicaciones para esta comunidad.');
        }
      },
      error: (error) => {
        console.error('Error al cargar las publicaciones:', error);
      },
    });
  }

  verificarPertenencia(): void {
    if (!this.usuarioLogado || !this.comunidadId) {
      this.pertenece = false;
      return;
    }
    const comunidadIdInt = parseInt(this.comunidadId);
    this.ComunidadesApiService.perteneceAComunidad(comunidadIdInt, this.usuarioLogado.id).subscribe({
      next: (response) => {
        this.pertenece = response.pertenece;
        console.log('Pertenencia a la comunidad:', this.pertenece);
      },
      error: (error) => {
        console.error('Error al verificar la pertenencia:', error);
        this.pertenece = false;
      }
    });
  }

  loadComunidad(): void {
    this.ComunidadesApiService.getComunidadById(this.comunidadId).subscribe({
      next: (data) => {
        if (data.fechaCreacion) {
          data.fechaCreacion = data.fechaCreacion.replace('[UTC]', '');
        }
        this.comunidad = data;
        console.log('Datos de la comunidad:', this.comunidad);
      },
      error: (error) => {
        console.error('Error al cargar la comunidad:', error);
      },
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
            this.PostApiService.deleteData(postId).subscribe({
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

  joinComunidad(): void {
    if (!this.usuarioLogado || !this.comunidadId) {
      Swal.fire({
        icon: 'warning',
        title: 'Acción no permitida',
        text: 'Debes estar logueado para unirte a una comunidad.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.ComunidadesApiService.joinComunidad(this.usuarioLogado.id, this.comunidadId).subscribe({
      next: (response) => {
        console.log('Usuario unido a la comunidad:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Unido a la comunidad!',
          text: 'Te has unido a la comunidad correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          // Recarga el componente
          this.c.notifyMenuRefresh();
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([`/comunidad/${this.comunidadId}`]);
          });
        });
      },
      error: (error) => {
        console.error('Error al unirse a la comunidad:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo unir a la comunidad. Inténtalo de nuevo más tarde.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
  reportarPost(postId: number, event: Event): void {
    event.stopPropagation(); // Evitar que el clic navegue al detalle de la publicación

    const dialogRef = this.dialog.open(ReportPostComponent, {
      width: '400px',
      data: {
        usuarioId: this.usuarioLogado.id,
        publicacionId: postId,
        comunidadId: parseInt(this.comunidadId)
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Datos del reporte:', result);
        // Llamar al servicio para enviar el reporte al backend
        this.reportesApiService.createReporte(result).subscribe({
          next: () => {
            console.log('Reporte enviado correctamente');
            this.snackBar.open('El reporte ha sido enviado con éxito.', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error al enviar el reporte:', error);
            this.snackBar.open('Hubo un error al enviar el reporte. Inténtalo de nuevo.', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        this.snackBar.open('El reporte fue cancelado.', 'Cerrar', { duration: 3000 });
      }
    });
  }
  abandonarComunidad(): void {
    if (!this.usuarioLogado || !this.comunidadId) {
      Swal.fire({
        icon: 'warning',
        title: 'Acción no permitida',
        text: 'Debes estar logueado para abandonar una comunidad.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    const comunidadIdInt = parseInt(this.comunidadId);
    this.ComunidadesApiService.abandonarComunidad(this.usuarioLogado.id, comunidadIdInt).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Has abandonado la comunidad!',
          text: 'Ya no perteneces a esta comunidad.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.c.notifyMenuRefresh();
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([`/comunidad/${this.comunidadId}`]);
          });
        });
      },
      error: (error) => {
        console.error('Error al abandonar la comunidad:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo abandonar la comunidad. Inténtalo de nuevo más tarde.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
  upvotePost(post: any, event: Event): void {
    event.stopPropagation();
    this.PostApiService.upvotePublicacion(post.id).subscribe({
      next: () => {
        post.votos = (post.votos || 0) + 1;
        this.loadPosts();
      },
      error: (err) => {
        console.error('Error al hacer upvote:', err);
        this.snackBar.open('No se pudo votar.', 'Cerrar', { duration: 2000 });
      }
    });
  }

  downvotePost(post: any, event: Event): void {
    event.stopPropagation();
    this.PostApiService.downvotePublicacion(post.id).subscribe({
      next: () => {
        post.votos = (post.votos || 0) - 1;
        this.loadPosts();
      },
      error: (err) => {
        console.error('Error al hacer downvote:', err);
        this.snackBar.open('No se pudo votar.', 'Cerrar', { duration: 2000 });
      }
    });
  }

  loadExpulsados(): void {
    if (!this.usuarioLogado || !this.comunidadId) {
      this.expulsado = false;
      return;
    }
    this.ComunidadesApiService.getUsuariosExpulsados(parseInt(this.comunidadId)).subscribe({
      next: (expulsados) => {
        const expulsado = expulsados.find((e: any) => e.usuarioId === this.usuarioLogado.id);
        if (expulsado) {
          const fechaFin = new Date(expulsado.fechaFin.replace('[UTC]', ''));
          const ahora = new Date();
          if (fechaFin > ahora) {
            this.expulsado = true;
            this.fechaFinExpulsion = fechaFin;
            this.motivoExpulsion = expulsado.razon; 
          } else {
            this.expulsado = false;
            this.fechaFinExpulsion = null;
            this.motivoExpulsion = null;
          }
        } else {
          this.expulsado = false;
          this.fechaFinExpulsion = null;
          this.motivoExpulsion = null;
        }
      },
      error: () => {
        this.expulsado = false;
        this.fechaFinExpulsion = null;
        this.motivoExpulsion = null;
      }
    });
  }
}
