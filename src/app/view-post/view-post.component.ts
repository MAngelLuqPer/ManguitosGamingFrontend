import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsApiService } from '../services/API/posts-api.service';
import { UsuarioApiService } from '../services/API/usuario-api.service';
import { ComentariosApiService } from '../services/API/comentarios-api.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import  {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ReportPostComponent } from '../main-view-community/modals/report-post/report-post.component';
import { ReportesApiService } from '../services/API/reportes-api.service';

@Component({
  selector: 'app-view-post',
  imports: [MatFormFieldModule,FormsModule,MatInputModule,MatButtonModule, MatIconModule, CommonModule, MatCardModule],
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss']
})
export class ViewPostComponent implements OnInit {
  postId: number | null = null;
  post: any = null;
  usuarioNombre: string | null = null;
  comentarios: any[] = [];
  mostrarFormularioComentario: boolean = false; // Controla la visibilidad del formulario
  usuarioId: number | null = null; // Propiedad global para almacenar el ID del usuario

  constructor(
    private route: ActivatedRoute,
    private postsApiService: PostsApiService,
    private usuarioApiService: UsuarioApiService,
    private comentariosApiService: ComentariosApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog, // Inyectar MatDialog
    private reportesApiService: ReportesApiService // Inyectar ReportesApiService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario desde localStorage
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      this.usuarioId = JSON.parse(usuario).id; // Asegúrate de que el objeto almacenado tenga un campo `id`
    } else {
      console.error('No se encontró información del usuario en localStorage.');
    }

    // Obtener el ID de la publicación desde la URL
    this.postId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.postId) {
      // Cargar los detalles de la publicación
      this.postsApiService.getById(this.postId).subscribe({
        next: (data) => {
          this.post = data;
          // Obtener el nombre del usuario al que pertenece la publicación
          if (this.post.usuarioId) {
            this.usuarioApiService.getUsuarioById(this.post.usuarioId).subscribe({
              next: (usuario) => {
                this.usuarioNombre = usuario.nombre;
              },
              error: (err) => {
                console.error('Error al cargar el usuario:', err);
              },
            });
          }
          // Cargar los comentarios
          this.cargarComentarios();
        },
        error: (err) => {
          console.error('Error al cargar la publicación:', err);
        },
      });
    }
  }

  private cargarComentarios(): void {
    if (!this.postId) {
        console.error('No se encontró el ID de la publicación.');
        return;
    }

    this.comentariosApiService.getComentariosByPostId(this.postId).subscribe({
        next: (comentarios) => {
            // Filtrar comentarios principales y respuestas
            const comentariosPrincipales = comentarios.filter(c => !c.comentarioPadreId);
            const respuestas = comentarios.filter(c => c.comentarioPadreId);

            // Mapear comentarios principales
            this.comentarios = comentariosPrincipales.map((comentario) => {
                comentario.fechaComentario = new Date(comentario.fechaComentario.replace('[UTC]', ''));
                comentario.respuestas = []; // Inicializar el array de respuestas
                return comentario;
            });

            // Asociar respuestas a sus comentarios principales
            respuestas.forEach((respuesta) => {
                const comentarioPadre = this.comentarios.find(c => c.id === respuesta.comentarioPadreId);
                if (comentarioPadre) {
                    respuesta.fechaComentario = new Date(respuesta.fechaComentario.replace('[UTC]', ''));
                    comentarioPadre.respuestas.push(respuesta);
                }
            });

            // Cargar los datos de los usuarios para los comentarios principales
            this.comentarios.forEach((comentario) => {
                this.usuarioApiService.getUsuarioById(comentario.usuarioId).subscribe({
                    next: (usuario) => {
                        comentario.usuarioNombre = usuario.nombre;
                    },
                    error: (err) => {
                        console.error('Error al cargar el usuario del comentario:', err);
                    },
                });

                // Cargar los datos de los usuarios para las respuestas
                comentario.respuestas.forEach((respuesta:any) => {
                    this.usuarioApiService.getUsuarioById(respuesta.usuarioId).subscribe({
                        next: (usuario) => {
                            respuesta.usuarioNombre = usuario.nombre;
                        },
                        error: (err) => {
                            console.error('Error al cargar el usuario de la respuesta:', err);
                        },
                    });
                });
            });
        },
        error: (err) => {
            console.error('Error al cargar los comentarios:', err);
        },
    });
  }

  // Método para alternar la visibilidad del formulario
  toggleFormularioComentario(): void {
    this.mostrarFormularioComentario = !this.mostrarFormularioComentario;
  }

  // Método para manejar la publicación del comentario
  publicarComentario(contenido: string): void {
    if (!contenido.trim()) {
      this.snackBar.open('El comentario no puede estar vacío.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.usuarioId === null) {
      this.snackBar.open('No se encontró información del usuario. No puedes comentar.', 'Cerrar', { duration: 3000 });
      return;
    }

    const nuevoComentario = {
      contenido,
      usuarioId: this.usuarioId,
      publicacionId: this.postId!,
    };

    this.comentariosApiService.createComentario(nuevoComentario).subscribe({
      next: (response) => {
        this.snackBar.open('Comentario publicado con éxito.', 'Cerrar', { duration: 3000 });
        this.cargarComentarios();
        this.mostrarFormularioComentario = false;
      },
      error: (err) => {
        console.error('Error al crear el comentario:', err);
        this.snackBar.open('Hubo un problema al publicar tu comentario.', 'Cerrar', { duration: 3000 });
      },
    });
  }

  borrarComentario(comentarioId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el comentario de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.comentariosApiService.deleteComentario(comentarioId).subscribe({
          next: (response) => {
            console.log('Comentario borrado:', response);
            this.snackBar.open('El comentario se ha borrado correctamente.', 'Cerrar', { duration: 3000 });
            this.cargarComentarios(); // Recargar los comentarios después de borrar
          },
          error: (err) => {
            console.error('Error al borrar el comentario:', err);
            this.snackBar.open('Hubo un problema al borrar el comentario.', 'Cerrar', { duration: 3000 });
          },
        });
      }
    });
  }

  toggleResponder(comentarioId: number): void {
    const comentario = this.comentarios.find(c => c.id === comentarioId);
    if (comentario) {
      comentario.mostrarResponder = !comentario.mostrarResponder;
    }
  }

  volver(): void {
    history.back();
  }

  publicarRespuesta(comentarioId: number, contenido: string): void {
    if (!contenido.trim()) {
      this.snackBar.open('La respuesta no puede estar vacía.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.usuarioId === null) {
      this.snackBar.open('No se encontró información del usuario. No puedes responder.', 'Cerrar', { duration: 3000 });
      return;
    }

    const nuevaRespuesta = {
      contenido,
      usuarioId: this.usuarioId,
      publicacionId: this.postId!,
      comentarioPadreId: comentarioId,
    };

    this.comentariosApiService.responderComentario(nuevaRespuesta).subscribe({
      next: () => {
        this.snackBar.open('Respuesta publicada con éxito.', 'Cerrar', { duration: 3000 });
        this.cargarComentarios();
      },
      error: (err) => {
        console.error('Error al publicar la respuesta:', err);
        this.snackBar.open('Hubo un problema al publicar tu respuesta.', 'Cerrar', { duration: 3000 });
      },
    });
  }

  abrirModalReporte(): void {
    if (!this.usuarioId || !this.postId) {
      this.snackBar.open('No se puede reportar esta publicación.', 'Cerrar', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(ReportPostComponent, {
      width: '400px',
      data: {
        usuarioId: this.usuarioId,
        publicacionId: this.postId,
        comunidadId: this.post?.comunidadId // Asegúrate de que `comunidadId` esté disponible en el objeto `post`
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Datos del reporte:', result);
        this.reportesApiService.createReporte(result).subscribe({
          next: () => {
            this.snackBar.open('El reporte ha sido enviado.', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error al enviar el reporte:', error);
            this.snackBar.open('Hubo un error al enviar el reporte.', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }
}

