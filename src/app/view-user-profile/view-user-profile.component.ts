import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioApiService } from '../services/API/usuario-api.service';
import { PostsApiService } from '../services/API/posts-api.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-view-user-profile',
  templateUrl: './view-user-profile.component.html',
  styleUrl: './view-user-profile.component.scss',
  imports: [MatIconModule, CommonModule, MatCardModule]
})
export class ViewUserProfileComponent implements OnInit {
  usuario: any = null;
  usuarioLogado: any = null;
  publicaciones: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private usuariosApiService: UsuarioApiService,
    private postsApiService: PostsApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.usuariosApiService.getUsuarioById(+id).subscribe(usuario => {
        // Limpiar el sufijo [UTC] de la fecha
        if (usuario && usuario.fechaCreacion) {
          usuario.fechaCreacion = usuario.fechaCreacion.replace('[UTC]', '');
        }
        this.usuario = usuario;
        // Si privacidad es 0 (público), cargar publicaciones
        if (usuario && usuario.privacidad === false) {
          this.postsApiService.getPublicacionesByUsuario(usuario.id).subscribe(posts => {
            this.publicaciones = posts;
          });
        }
      });
    }
    this.usuarioLogado = JSON.parse(localStorage.getItem('usuario') || 'null');
  }
}
