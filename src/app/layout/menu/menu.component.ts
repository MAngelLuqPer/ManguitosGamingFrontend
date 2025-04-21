import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { menuList } from './menu-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ComunidadesApiService } from '../../services/API/comunidades-api.service';
import { MenuItem } from './menu-list';


@Component({
  selector: 'app-menu',
  imports: [MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    CommonModule,
    MatTooltipModule,
    MatExpansionModule,
    RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  sideMenu :MenuItem[] = [];;
  collapse = false;
  toggleSidebar() {
    this.collapse = !this.collapse;
  }
  constructor(private router: Router, private comunidadesApiService: ComunidadesApiService) {}

  ngOnInit(): void {
    this.sideMenu = [...menuList];
    this.loadComunidades();
  }

  loadComunidades(): void {
    this.comunidadesApiService.getAllComunidades().subscribe((comunidades) => {
      const comunidadesMenu = new MenuItem(
        'Comunidades',
        '/adminUsers',
        'Gestiona las comunidades',
        'account_circle',
        comunidades.map((comunidad) => new MenuItem(
          comunidad.nombre,
          `/comunidad/${comunidad.id}`,
          comunidad.descripcion,
          '', // Sin icono específico
          [],
          comunidad.foto // Agregar la foto de la comunidad
        ))
      );
      this.sideMenu.splice(1, 0, comunidadesMenu); // Inserta después de "Inicio"
    });
  }

  isChildActive(item: any): boolean {
    if (!item.children) {
      return false;
    }
    return item.children.some((child: any) => this.router.isActive(child.route, false));
  }
  
}