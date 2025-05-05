import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgModel } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PostsApiService } from '../services/API/posts-api.service';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
@Component({
  selector: 'app-create-publi-component',
  imports: [ SweetAlert2Module,FormsModule,MatButton,MatInputModule,MatFormFieldModule,MatTabsModule],
  templateUrl: './create-publi-component.component.html',
  styleUrl: './create-publi-component.component.scss'
})
export class CreatePubliComponentComponent implements OnInit {
  titulo: string = '';
  descripcion: string = '';
  usuarioId: number | null = null;
  comunidadId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private postsApiService: PostsApiService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario desde el localStorage
    const user = localStorage.getItem('usuario');
    const userData = user ? JSON.parse(user) : null;
    const storedUserId = userData ? userData.id : null;
    this.usuarioId = storedUserId ? +storedUserId : null;

    // Obtener el ID de la comunidad desde la URL
    const comunidadIdParam = this.route.snapshot.paramMap.get('id');
    this.comunidadId = comunidadIdParam ? +comunidadIdParam : null;

    if (!this.comunidadId) {
      console.error('No se pudo obtener el ID de la comunidad.');
    }
  }

  goBack(): void {
    this.location.back(); // Navega a la página anterior
  }

  onSubmit(): void {
    if (!this.usuarioId || !this.comunidadId) {
      console.error('Faltan datos: usuarioId o comunidadId no están definidos.');
      return;
    }
    

    const publiDTO = {
      titulo: this.titulo,
      contenido: this.descripcion,
      usuarioId: this.usuarioId,
      comunidadId: this.comunidadId
    };

    this.postsApiService.createPublicacion(publiDTO).subscribe({
      next: (response) => {
        console.log('Publicación creada con éxito:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Publicación creada con éxito.',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        console.error('Error al crear la publicación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al crear la publicación.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
