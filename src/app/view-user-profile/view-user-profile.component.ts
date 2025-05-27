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
    private comunidadesApiService: ComunidadesApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.cargarUsuario(+id);
      }
    });
    this.usuarioLogado = JSON.parse(localStorage.getItem('usuario') || 'null');
  }

  cargarUsuario(id: number) {
    this.usuariosApiService.getUsuarioById(id).subscribe(usuario => {
      if (usuario && usuario.fechaCreacion) {
        usuario.fechaCreacion = usuario.fechaCreacion.replace('[UTC]', '');
      }
      this.usuario = usuario;
      if (usuario && usuario.privacidad === false) {
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
      }
    });
  }
}
