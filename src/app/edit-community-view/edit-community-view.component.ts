import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunidadesApiService } from '../services/API/comunidades-api.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-community-view',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './edit-community-view.component.html',
  styleUrls: ['./edit-community-view.component.scss']
})
export class EditCommunityViewComponent implements OnInit {
  comunidad: any = {
    nombre: '',
    descripcion: '',
    reglas: [''],
    banner: null,
    foto: null
  };
  previewBanner: string | ArrayBuffer | null = null;
  previewLogo: string | ArrayBuffer | null = null;

  constructor(
    private route: ActivatedRoute,
    private comunidadesApiService: ComunidadesApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const comunidadId = this.route.snapshot.paramMap.get('id');
    if (comunidadId) {
      this.comunidadesApiService.getComunidadById(comunidadId).subscribe({
        next: (data) => {
          this.comunidad = {
            ...data,
            // Elimina el prefijo "m/" si existe al inicio del nombre
            nombre: data.nombre.startsWith('m/') ? data.nombre.slice(2).trim() : data.nombre,
            reglas: data.reglas ? data.reglas.split(',').map((r: string) => r.trim()) : ['']
          };
          this.previewBanner = data.banner;
          this.previewLogo = data.foto;
        }
      });
    }
  }

  addRegla(): void {
    this.comunidad.reglas.push('');
  }

  removeRegla(index: number): void {
    this.comunidad.reglas.splice(index, 1);
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  onBannerChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.previewBanner = reader.result;
      reader.readAsDataURL(file);
      this.comunidad.banner = file;
    }
  }

  onLogoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.previewLogo = reader.result;
      reader.readAsDataURL(file);
      this.comunidad.foto = file;
    }
  }

  onSubmit(): void {
    const comunidadEditada = {
      ...this.comunidad,
      reglas: this.comunidad.reglas.join(', ')
    };
    // Aquí deberías manejar la subida de archivos si tu backend lo requiere
    this.comunidadesApiService.editarComunidad(this.comunidad.id,comunidadEditada).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Comunidad actualizada!',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/comunidad', this.comunidad.id]);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la comunidad.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/comunidad', this.comunidad.id]);
  }
}
