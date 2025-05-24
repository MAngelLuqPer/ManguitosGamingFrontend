import { Component, OnInit, Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { menuList, MenuItem } from './menu-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ComunidadesApiService } from '../../services/API/comunidades-api.service';

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
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  sideMenu: MenuItem[] = [];
  userId: number = 0; // Obtén el ID del usuario logueado según tu lógica
  @Input() collapse: boolean = false;

  constructor(private router: Router, private comunidadesApi: ComunidadesApiService) {}

  ngOnInit() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      this.userId = JSON.parse(usuario).id;

      // Cargar comunidades donde es miembro
      this.comunidadesApi.getComunidadesDeUsuario(this.userId).subscribe(comunidades => {
        const comunidadItems = comunidades.map((com: any) =>
          new MenuItem(
            com.nombre,
            `/comunidad/${com.id}`,
            com.descripcion,
            'group',
            [],
           'assets/images/MangoLogo.png'
          )
        );

        // Cargar comunidades donde es creador
        this.comunidadesApi.getComunidadesCreadasPorUsuario(this.userId).subscribe(creadas => {
          const creadasItems = creadas.map((com: any) =>
            new MenuItem(
              com.nombre,
              `/comunidad/${com.id}`,
              com.descripcion,
              'star',
              [],
              com.foto ? com.foto : 'assets/images/MangoLogo.png'
            )
          );

          this.sideMenu = [
            ...menuList,
            new MenuItem('Comunidades', '', 'Tus comunidades', 'group', comunidadItems),
            new MenuItem('Creadas por ti', '', 'Comunidades que has creado', 'star', creadasItems)
          ];
        });
      });
    }
  }

  toggleSidebar() {
    this.collapse = !this.collapse;
  }
  
  isChildActive(item: any): boolean {
    if (!item.children) {
      return false;
    }
    return item.children.some((child: any) => this.router.isActive(child.route, false));
  }
}