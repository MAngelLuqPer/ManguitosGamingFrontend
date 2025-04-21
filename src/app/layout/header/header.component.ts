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

@Component({
  selector: 'app-header',
  imports: [ MatMenuModule,RouterModule,MatInputModule, MatIconModule,MatButtonModule,MatSlideToggleModule,RouterLink,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(public lightDarkService: LightDarkService) {}
  toggleDarkMode(): void {
    this.lightDarkService.toggleDarkMode();
  }
}
