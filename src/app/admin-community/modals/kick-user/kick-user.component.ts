import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ComunidadesApiService } from '../../../services/API/comunidades-api.service';

@Component({
  selector: 'app-kick-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './kick-user.component.html',
  styleUrls: ['./kick-user.component.scss']
})
export class KickUserComponent {
  motivo: string = '';
  fechaExpulsion: Date | null = null;
  minDate: Date;

  constructor(
    public dialogRef: MatDialogRef<KickUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nombre: string; usuarioId: number; adminId: number, comunidadId: number },
    private comunidadesApiService: ComunidadesApiService // Inyectar el servicio
  ) {
    this.minDate = new Date(); // Establece la fecha mínima como la fecha actual
    this.minDate.setDate(this.minDate.getDate() + 1); // Añadir un día
  }

  onExpulsar(): void {
    if (this.motivo && this.fechaExpulsion) {
      const expulsionDTO = {
        usuarioId: this.data.usuarioId,
        adminId: this.data.adminId,
        razon: this.motivo,
        fechaFin: this.fechaExpulsion.toISOString(), // Convertir la fecha a formato ISO
      };
      console.log('Expulsión DTO:', expulsionDTO); // Verifica el contenido de expulsionDTO
      this.comunidadesApiService.expulsarUsuario(this.data.comunidadId, expulsionDTO).subscribe({
        next: () => {
          this.dialogRef.close(true); // Cerrar el modal y devolver un resultado exitoso
        },
        error: (error) => {
          console.error('Error al expulsar al usuario:', error);
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Cerrar el modal sin realizar ninguna acción
  }
}
