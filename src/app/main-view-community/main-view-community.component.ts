import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ComunidadesApiService } from '../services/API/comunidades-api.service';
import { CommonModule } from '@angular/common';
import {  MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-main-view-community',
  imports: [MatIconModule,MatCardModule,CommonModule],
  templateUrl: './main-view-community.component.html',
  styleUrl: './main-view-community.component.scss'
})
export class MainViewCommunityComponent implements OnInit{
  comunidadId!: string;
  comunidad:any;
  posts: any[] = [];
constructor(private route: ActivatedRoute, private ComunidadesApiService: ComunidadesApiService) {}


  ngOnInit(): void {
    // Captura el parámetro `id` de la URL
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
        // Procesa la fecha de creación para eliminar el sufijo [UTC]
        if (data.fechaCreacion) {
          data.fechaCreacion = data.fechaCreacion.replace('[UTC]', '');
        }
        this.comunidad = data;
        console.log('Datos de la comunidad:', this.comunidad); // Verifica los datos cargados
      },
      error: (error) => {
        console.error('Error al cargar la comunidad:', error);
      },
    });
  }
}
