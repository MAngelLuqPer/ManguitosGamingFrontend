import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-post',
  imports: [ReactiveFormsModule,MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './report-post.component.html',
  styleUrls: ['./report-post.component.scss']
})
export class ReportPostComponent {
  reportForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ReportPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuarioId: number; publicacionId: number; comunidadId: number },
    private fb: FormBuilder
  ) {
    this.reportForm = this.fb.group({
      motivo: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      const reporte = {
        motivo: this.reportForm.value.motivo,
        usuarioId: this.data.usuarioId,
        publicacionId: this.data.publicacionId,
        comunidadId: this.data.comunidadId
      };
      this.dialogRef.close(reporte); // Enviar los datos al componente padre
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Cerrar el modal sin enviar datos
  }
}
