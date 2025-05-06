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
@Component({
  selector: 'app-main-view-community',
  imports: [RouterLink,MatButtonModule, MatIconModule, MatCardModule, CommonModule],
  templateUrl: './main-view-community.component.html',
  styleUrl: './main-view-community.component.scss'
})
export class MainViewCommunityComponent implements OnInit {
  usuarioLogado: any = null; 
  comunidadId!: string;
  comunidad: any;
  posts: any[] = [];
  pertenece: boolean | null = null;

  constructor(private route: ActivatedRoute, private ComunidadesApiService: ComunidadesApiService,private router: Router,private PostApiService: PostsApiService) {}

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
    });
  }

  loadPosts(): void {
    this.ComunidadesApiService.getPostsByComunidadId(this.comunidadId).subscribe((data) => {
      this.posts = data.map((post) => ({
        ...post,
        fechaPublicacion: post.fechaPublicacion.replace('[UTC]', ''), // Elimina el sufijo [UTC]
      }));
      if (this.posts.length === 0) {
        console.log('No se encontraron publicaciones para esta comunidad.');
      }
    }, error => {
      console.error('Error al cargar las publicaciones:', error);
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

  borrarPost(postId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      this.PostApiService.deleteData(postId).subscribe({
        next: () => {
          // Elimina el post localmente después de eliminarlo en el servidor
          this.posts = this.posts.filter(post => post.id !== postId);
          console.log(`Publicación con ID ${postId} eliminada.`);
        },
        error: (err) => {
          console.error('Error al eliminar la publicación:', err);
        }
      });
    }
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
}
