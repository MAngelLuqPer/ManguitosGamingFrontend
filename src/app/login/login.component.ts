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
import { UsuarioApiService } from '../services/usuario-api.service';
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
  login(): void {
    const email = this.emailFormControl.value;
    const password = this.passwordFormControl.value;
  
    if (!email || !password) {
      console.error('El email o la contraseña están vacíos.');
      this.loginError = 'El email o la contraseña están vacíos.';
      return;
    }
  
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      this.usuarioApiService.login(email, password).subscribe({
        next: (response) => {
          console.log('Inicio de sesión exitoso:', response);
          localStorage.setItem('usuario', JSON.stringify(response));
          this.loginError = null;
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err.error);
          this.loginError = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
        }
      });
    } else {
      console.error('Formulario inválido');
      this.loginError = 'Por favor, completa correctamente el formulario.';
    }
  }
}

