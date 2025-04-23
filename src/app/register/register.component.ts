import { Component } from '@angular/core';
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms'; 
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { UsuarioApiService } from '../services/usuario-api.service';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
  
}

@Component({
  selector: 'app-register',
  imports: [ ReactiveFormsModule,
    CommonModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatRadioModule
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})



export class RegisterComponent {
    visibility: boolean = true;
    desc: string = '';
    registerError: string | null = null;
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    passwordFormControl = new FormControl('', [Validators.required,
      Validators.minLength(8),
      Validators.pattern(/[A-Z]/),
      Validators.pattern(/[a-z]/),
      Validators.pattern(/\d/),  
      Validators.pattern(/[\W_]/)
      ]);
      confirmPasswordControl = new FormControl('', [Validators.required,]);
      nameFormControl = new FormControl('', [Validators.required]);
  
    matcher = new MyErrorStateMatcher();
    constructor(private UsuarioApiService: UsuarioApiService, private Router: Router){}

    get hasUpperCase(): boolean {
      const value = this.passwordFormControl.value || '';
      return /[A-Z]/.test(value);
    }
    
    get hasLowerCase(): boolean {
      const value = this.passwordFormControl.value || '';
      return /[a-z]/.test(value); 
    }

    get confirmPasswordMatch(): boolean {
      const password = this.passwordFormControl.value || '';
      const confirmPassword = this.confirmPasswordControl.value || '';
      if (password === '' || confirmPassword === '') {
        return false;
      } 
      else {
      return password === confirmPassword;
      }
    }
    
    get hasNumber(): boolean {
      const value = this.passwordFormControl.value || '';
      return /\d/.test(value);
    }
    
    get hasSpecialChar(): boolean {
      const value = this.passwordFormControl.value || '';
      return /[\W_]/.test(value); 
    }
    isFormValid(): boolean {
      return (
        this.emailFormControl.valid &&
        this.passwordFormControl.valid &&
        this.confirmPasswordControl.valid &&
        this.confirmPasswordMatch
      );
    }

    register():void{
      
      if (!this.isFormValid()) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
      }
      const nombre = this.nameFormControl.value!;
      const email = this.emailFormControl.value!;
      const password = this.passwordFormControl.value!;
      const descripcion = this.desc;
      const privacidad = this.visibility;
  
      this.UsuarioApiService.register(nombre, email, descripcion, privacidad, password).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          this.registerError = 'Error al registrar el usuario. Por favor, inténtalo de nuevo.';
          console.error(error);
        },
      });
    }
}