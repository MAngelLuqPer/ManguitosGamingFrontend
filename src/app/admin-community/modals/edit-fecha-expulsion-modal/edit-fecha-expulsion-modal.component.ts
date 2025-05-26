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
  selector: 'app-edit-fecha-expulsion-modal',
    providers: [provideNativeDateAdapter()],
  templateUrl: './edit-fecha-expulsion-modal.component.html',
  styleUrls: ['./edit-fecha-expulsion-modal.component.scss'],
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatFormFieldModule,FormsModule,MatButtonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule]
})
export class EditFechaExpulsionModalComponent {
  nuevaFecha: Date | null;

  constructor(
    public dialogRef: MatDialogRef<EditFechaExpulsionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fechaFin: string }
  ) {
    this.nuevaFecha = data.fechaFin ? new Date(data.fechaFin) : null;
  }

  guardar() {
    // Si necesitas enviar la fecha como string ISO:
    this.dialogRef.close(this.nuevaFecha ? this.nuevaFecha.toISOString() : null);
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
