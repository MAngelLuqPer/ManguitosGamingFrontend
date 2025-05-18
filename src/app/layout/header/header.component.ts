import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LightDarkService } from '../../services/light-dark.service'; 
import { OnInit } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { NgIf } from '@angular/common';
import { Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [ NgIf,MatMenu,MatMenuModule,RouterModule,MatInputModule, MatIconModule,MatButtonModule,MatSlideToggleModule,RouterLink,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  @Input() collapse: boolean = false; // Recibe el estado del menú desde el componente padre
  @Output() toggleSidebar = new EventEmitter<void>(); // Emite el evento para alternar el estado

  onToggleSidebar(): void {
    this.toggleSidebar.emit(); // Emite el evento al componente padre
  }
  userName: string | null = null;
  constructor(public lightDarkService: LightDarkService,private Router: Router) {}
  toggleDarkMode(): void {
    this.lightDarkService.toggleDarkMode();
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        const usuarioObj = JSON.parse(usuario);
        this.userName = usuarioObj.nombre || null;
      }
    }
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.userName = null;
    this.Router.navigate(['/']);
  }

}
