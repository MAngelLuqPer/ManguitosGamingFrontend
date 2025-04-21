import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LightDarkService } from './services/light-dark.service'; // Ajusta la ruta si es necesario
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'proyectofct';
  constructor(private lightDarkService: LightDarkService) {}
}
