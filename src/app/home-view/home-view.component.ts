import { Component, OnInit } from '@angular/core';
import { ComunidadesApiService } from '../services/API/comunidades-api.service';
import { PostsApiService } from '../services/API/posts-api.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UsuarioApiService } from '../services/API/usuario-api.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReportPostComponent } from '../main-view-community/modals/report-post/report-post.component';
import { ReportesApiService } from '../services/API/reportes-api.service';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/input';
import { MatLabel } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home-view',
  imports: [FormsModule,MatLabel,MatOptionModule,MatSelect,MatFormField,MatButton,RouterLink,MatIcon,CommonModule, MatCardModule],
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {
  topComunidades: any[] = [];
  allTopPosts: any[] = [];
  topPosts: any[] = [];
  usuarioLogado: any = null;
  ordenSeleccionado: string = 'votos';

  constructor(
    private comunidadesApi: ComunidadesApiService,
    private postsApi: PostsApiService,
    private router: Router,
    private usuarioApi: UsuarioApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private reporteApi: ReportesApiService
  ) {}

  goToComunidad(id: number) {
    this.router.navigate(['/comunidad', id]);
  }

  ngOnInit() {
    this.comunidadesApi.getAllComunidades().subscribe(comunidades => {
      this.topComunidades = comunidades
        .sort((a: any, b: any) => (b.numMiembros || 0) - (a.numMiembros || 0))
        .slice(0, 5);

      const comunidadIds = this.topComunidades.map(c => c.id);
      const postsArray: any[] = [];
      let completedRequests = 0;

      if (comunidadIds.length === 0) {
        this.topPosts = [];
        this.allTopPosts = [];
        return;
      }

      comunidadIds.forEach((id: string) => {
        this.comunidadesApi.getPostsByComunidadId(id).subscribe(posts => {
          // Ordena los posts por numVotos descendente y toma los 5 primeros
          const top5Posts = posts
            .sort((a: any, b: any) => (b.numVotos || 0) - (a.numVotos || 0))
            .slice(0, 5);

          top5Posts.forEach((post: any) => {
            // Normaliza la fecha
            if (typeof post.fechaPublicacion === 'string') {
              post.fechaPublicacion = post.fechaPublicacion.replace('[UTC]', '');
            }
          });
          postsArray.push(...top5Posts);
          completedRequests++;
          if (completedRequests === comunidadIds.length) {
            // Obtén los nombres de comunidad y usuario para cada post
            const topPosts = postsArray;
            const comunidadRequests = topPosts.map(post =>
              this.comunidadesApi.getComunidadById(post.comunidadId)
            );
            const usuarioRequests = topPosts.map(post =>
              this.usuarioApi.getUsuarioById(post.usuarioId)
            );

            forkJoin([...comunidadRequests, ...usuarioRequests]).subscribe(results => {
              const comunidades = results.slice(0, topPosts.length);
              const usuarios = results.slice(topPosts.length);

              topPosts.forEach((post, i) => {
                post.comunidadNombre = comunidades[i]?.nombre || 'Desconocida';
                post.usuarioNombre = usuarios[i]?.nombre || 'Desconocido';
                post.comunidadNumMiembros = comunidades[i]?.numMiembros || 0; // Añade esta línea
              });

              this.allTopPosts = topPosts; 
              this.ordenarPosts(); 
            });
          }
        });
      });
    });

    const usuario = localStorage.getItem('usuario');
    this.usuarioLogado = usuario ? JSON.parse(usuario) : null;
  }

  upvotePost(post: any, event: Event): void {
    event.stopPropagation();
    this.postsApi.upvotePublicacion(post.id).subscribe({
      next: () => {
        post.numVotos = (post.numVotos || 0) + 1;
      },
      error: (err) => {
        console.error('Error al hacer upvote:', err);
        this.snackBar.open('No se pudo votar.', 'Cerrar', { duration: 2000 });
      }
    });
  }

  downvotePost(post: any, event: Event): void {
    event.stopPropagation();
    this.postsApi.downvotePublicacion(post.id).subscribe({
      next: () => {
        post.numVotos = (post.numVotos || 0) - 1;
      },
      error: (err) => {
        console.error('Error al hacer downvote:', err);
        this.snackBar.open('No se pudo votar.', 'Cerrar', { duration: 2000 });
      }
    });
  }


  reportarPost(postId: number, event: Event): void {
    event.stopPropagation();

    const usuario = localStorage.getItem('usuario');
    const usuarioLogado = usuario ? JSON.parse(usuario) : null;
    if (!usuarioLogado) {
      this.snackBar.open('Debes iniciar sesión para reportar.', 'Cerrar', { duration: 3000 });
      return;
    }

    // Busca el post para obtener el comunidadId
    const post = this.topPosts.find(p => p.id === postId);
    const comunidadId = post?.comunidadId;

    const dialogRef = this.dialog.open(ReportPostComponent, {
      width: '400px',
      data: {
        usuarioId: usuarioLogado.id,
        publicacionId: postId,
        comunidadId: comunidadId
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reporteApi.createReporte(result).subscribe({
          next: () => {
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

  ordenarPosts(): void {
    let postsOrdenados = [...this.allTopPosts];
    if (this.ordenSeleccionado === 'fecha') {
      postsOrdenados.sort((a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime());
    } else if (this.ordenSeleccionado === 'votos') {
      postsOrdenados.sort((a, b) => (b.numVotos || 0) - (a.numVotos || 0));
    } else if (this.ordenSeleccionado === 'comunidad-mas-miembros') {
      postsOrdenados.sort((a, b) => (b.comunidadNumMiembros || 0) - (a.comunidadNumMiembros || 0));
    } else if (this.ordenSeleccionado === 'comunidad-menos-miembros') {
      postsOrdenados.sort((a, b) => (a.comunidadNumMiembros || 0) - (b.comunidadNumMiembros || 0));
    }
    this.topPosts = postsOrdenados;
  }
}
