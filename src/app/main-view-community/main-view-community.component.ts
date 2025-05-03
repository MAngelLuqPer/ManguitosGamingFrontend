import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ComunidadesApiService } from '../services/API/comunidades-api.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main-view-community',
  imports: [MatButtonModule, MatIconModule, MatCardModule, CommonModule],
  templateUrl: './main-view-community.component.html',
  styleUrl: './main-view-community.component.scss'
})
export class MainViewCommunityComponent implements OnInit {
  usuarioLogado: any = null; 
  comunidadId!: string;
  comunidad: any;
  posts: any[] = [];

  constructor(private route: ActivatedRoute, private ComunidadesApiService: ComunidadesApiService) {}

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
    });
  }

  loadPosts(): void {
    this.ComunidadesApiService.getPostsByComunidadId(this.comunidadId).subscribe((data) => {
      this.posts = data.map((post) => ({
        ...post,
        fechaPublicacion: post.fechaPublicacion.replace('[UTC]', ''), // Elimina el sufijo [UTC]
      }));
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
}
