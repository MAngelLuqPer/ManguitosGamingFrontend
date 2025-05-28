import { Component } from '@angular/core';
import { FormControl,  Validators,  FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UsuarioApiService } from '../services/API/usuario-api.service';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
  
}

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})


export class LoginComponent {
  loginError: string | null = null;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher(); constructor(private usuarioApiService: UsuarioApiService, private router: Router) {}
  async login(): Promise<void> {
    const email = this.emailFormControl.value;
    const password = this.passwordFormControl.value;

    if (!email || !password) {
      this.loginError = 'El email o la contraseña están vacíos.';
      return;
    }

    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      try {
        // 1. Obtener la IP pública
        const ip = await fetch('https://api.ipify.org?format=json')
          .then(res => res.json())
          .then(data => data.ip);

        // 2. Llamar al login con la IP
        this.usuarioApiService.login(email, password, ip).subscribe({
          next: (response) => {
            localStorage.setItem('usuario', JSON.stringify(response));
            this.loginError = null;
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.loginError = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
          }
        });
      } catch (e) {
        this.loginError = 'No se pudo obtener la IP pública.';
      }
    } else {
      this.loginError = 'Por favor, completa correctamente el formulario.';
    }
  }
}

