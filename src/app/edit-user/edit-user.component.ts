import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioApiService } from '../services/API/usuario-api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  usuarioLogado: any = null;
  nameFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  emailFormControl = new FormControl({ value: '', disabled: true });
  desc: string = '';
  visibility: boolean = false;

  constructor(
    private usuarioApi: UsuarioApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.usuarioLogado = JSON.parse(localStorage.getItem('usuario') || 'null');
    if (this.usuarioLogado) {
      this.nameFormControl.setValue(this.usuarioLogado.nombre.replace(/^u\//, ''));
      this.emailFormControl.setValue(this.usuarioLogado.email);
      this.desc = this.usuarioLogado.descripcion || '';
      this.visibility = !!this.usuarioLogado.privacidad;
    }
  }

  isFormValid(): boolean {
    return this.nameFormControl.valid;
  }

  guardarCambios(): void {
    if (!this.isFormValid() || !this.usuarioLogado) return;

    const datos = {
      nombre: this.nameFormControl.value ?? '',
      descripcion: this.desc,
      privacidad: this.visibility
    };

    this.usuarioApi.editarUsuario(this.usuarioLogado.id, datos).subscribe({
      next: (resp) => {
        // Actualiza localStorage y redirige al perfil
        console.log('Perfil actualizado:', resp);
        localStorage.setItem('usuario', JSON.stringify({ ...this.usuarioLogado, ...resp }));
        this.snackBar.open('Perfil actualizado correctamente.', 'Cerrar', { duration: 3000 });
        setTimeout(() => {
          this.router.navigate(['/usuario', this.usuarioLogado.id]);
        }, 1200);
      },
      error: (err) => {
        this.snackBar.open('Error al actualizar el perfil. Inténtalo de nuevo.', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
