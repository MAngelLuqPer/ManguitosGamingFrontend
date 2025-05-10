import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ComunidadesApiService } from '../services/API/comunidades-api.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-create-community',
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './create-community.component.html',
  styleUrl: './create-community.component.scss'
})
export class CreateCommunityComponent {
  comunidad = {
    nombre: '',
    descripcion: '',
    reglas: [''],
    idUsuAdmin: localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')!).id : null
  };

  constructor(
    private comunidadesApiService: ComunidadesApiService,
    private router: Router
  ) {}

  addRegla(): void {
    this.comunidad.reglas.push(''); 
  }

  removeRegla(index: number): void {
    this.comunidad.reglas.splice(index, 1); 
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  onSubmit(): void {
    const comunidadConReglasString = {
      ...this.comunidad,
      reglas: this.comunidad.reglas.join(', ')
    };
    console.log('Datos enviados:', comunidadConReglasString); 
    this.comunidadesApiService.crearComunidad(comunidadConReglasString).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Comunidad creada!',
          text: 'La comunidad se ha creado correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/']);
        });
      },
      error: (error) => {
        console.error('Error al crear la comunidad:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear la comunidad. Inténtalo de nuevo más tarde.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

}
