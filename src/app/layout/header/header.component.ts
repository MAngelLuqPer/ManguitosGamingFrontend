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
import { UsuarioApiService } from '../../services/API/usuario-api.service';
import { ComunidadesApiService } from '../../services/API/comunidades-api.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [ CommonModule,MatCardModule,NgIf,MatMenu,MatMenuModule,RouterModule,MatInputModule, MatIconModule,MatButtonModule,MatSlideToggleModule,RouterLink,FormsModule],
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
  searchTerm: string = '';
  filteredUsers: any[] = [];
  filteredCommunities: any[] = [];
  showResults: boolean = false;
  searchTimeout: any;

  constructor(
    public lightDarkService: LightDarkService,
    private Router: Router,
    private usuariosApi: UsuarioApiService,
    private comunidadesApi: ComunidadesApiService
  ) {}

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

  onSearchChange() {
    clearTimeout(this.searchTimeout);
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [];
      this.filteredCommunities = [];
      return;
    }
    // Espera 300ms tras escribir para no saturar el backend
    this.searchTimeout = setTimeout(() => {
      this.usuariosApi.buscarUsuariosPorNombre(this.searchTerm).subscribe(users => this.filteredUsers = users || []);
      this.comunidadesApi.buscarComunidadesPorNombre(this.searchTerm).subscribe(coms => this.filteredCommunities = coms || []);
    }, 300);
  } 

  clearSearch() {
    this.searchTerm = '';
    this.filteredUsers = [];
    this.filteredCommunities = [];
    this.showResults = false;
  }

  onBlur() {
    // Espera un poco para permitir click en los resultados
    setTimeout(() => this.showResults = false, 200);
  }

  goToUser(user: any) {
    this.clearSearch();
    this.Router.navigate(['/usuario', user.id]);
  }

  goToComunidad(comunidad: any) {
    this.clearSearch();
    this.Router.navigate(['/comunidad', comunidad.id]);
  }
}
