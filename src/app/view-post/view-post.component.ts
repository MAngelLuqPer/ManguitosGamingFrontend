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
import Swal from 'sweetalert2';
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
    private comentariosApiService: ComentariosApiService
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
        this.comentarios = comentarios.map((comentario) => {
          // Convertir la fecha a un objeto Date válido
          comentario.fechaComentario = new Date(comentario.fechaComentario.replace('[UTC]', ''));
          return comentario;
        });

        // Cargar los datos de los usuarios de cada comentario
        this.comentarios.forEach((comentario) => {
          this.usuarioApiService.getUsuarioById(comentario.usuarioId).subscribe({
            next: (usuario) => {
              comentario.usuarioNombre = usuario.nombre;
            },
            error: (err) => {
              console.error('Error al cargar el usuario del comentario:', err);
            },
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El comentario no puede estar vacío.',
      });
      return;
    }

// Obtener el ID del usuario desde localStorage
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      console.error('No se encontró información del usuario en localStorage.');
      return;
    }

    if (this.usuarioId === null) {
      console.error('El usuarioId no puede ser null.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo publicar el comentario porque no se encontró el usuario.',
      });
      return;
    }

    const nuevoComentario = {
      contenido,
      usuarioId: this.usuarioId, // Usar el ID del usuario global
      publicacionId: this.postId!,
    };

    this.comentariosApiService.createComentario(nuevoComentario).subscribe({
      next: (response) => {
        console.log('Comentario creado:', response);
        this.cargarComentarios();
        this.mostrarFormularioComentario = false; // Ocultar el formulario

        Swal.fire({
          icon: 'success',
          title: 'Comentario publicado',
          text: 'Tu comentario ha sido publicado con éxito.',
        });
      },
      error: (err) => {
        console.error('Error al crear el comentario:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al publicar tu comentario.',
        });
      },
    });
  }

  borrarComentario(comentarioId: number): void {
    this.comentariosApiService.deleteComentario(comentarioId).subscribe({
      next: (response) => {
        console.log('Comentario borrado:', response);
        this.comentarios = this.comentarios.filter((comentario) => comentario.id !== comentarioId);
      },
      error: (err) => {
        console.error('Error al borrar el comentario:', err);
      },
    });
  }
}

