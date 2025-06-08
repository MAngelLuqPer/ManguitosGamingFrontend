import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ComunidadesApiService } from '../../services/API/comunidades-api.service';
import { UsuarioApiService } from '../../services/API/usuario-api.service';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ComentariosApiService } from '../../services/API/comentarios-api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-graphics',
  imports: [BaseChartDirective, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.component.scss'
})
export class GraphicsComponent implements OnInit {
  comunidadId!: string;

  // Gráfica de posts
  barChartOptions: ChartConfiguration['options'] = { responsive: true };
  barChartLabels: string[] = [];
  barChartData: { data: number[]; label: string; backgroundColor?: string[] }[] = [{ data: [], label: 'Posts por usuario' }];
  barChartType: ChartType = 'bar';

  // Gráfica de comentarios
  commentChartLabels: string[] = [];
  commentChartData: { data: number[]; label: string; backgroundColor?: string[] }[] = [{ data: [], label: 'Comentarios por usuario' }];
  commentChartType: ChartType = 'bar';

  loading = true;
  loadingComments = true;

  constructor(
    private comunidadesApiService: ComunidadesApiService,
    private usuarioApiService: UsuarioApiService,
    private comentariosApiService: ComentariosApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.comunidadId = this.route.snapshot.paramMap.get('id')!;
    this.setChartOptions();
    this.cargarDatos();
    this.cargarComentarios();

    // Escucha cambios de modo oscuro
    const observer = new MutationObserver(() => this.setChartOptions());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  // Configura las opciones de los gráficos según el modo
  setChartOptions() {
    const isDark = document.documentElement.classList.contains('dark-mode');
    this.barChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: isDark ? '#fff' : '#222'
          }
        }
      },
      scales: {
        x: {
          ticks: { color: isDark ? '#fff' : '#222' },
          grid: { color: isDark ? '#444' : '#eee' }
        },
        y: {
          ticks: { color: isDark ? '#fff' : '#222' },
          grid: { color: isDark ? '#444' : '#eee' }
        }
      }
    };
  }

  goBack(): void {
    window.history.back();
  }
  cargarDatos(): void {
    this.comunidadesApiService.getPostsByComunidadId(this.comunidadId).subscribe({
      next: async (posts) => {
        const conteo: { [usuarioId: number]: number } = {};
        posts.forEach((post: any) => {
          conteo[post.usuarioId] = (conteo[post.usuarioId] || 0) + 1;
        });

        const usuarioIds = Object.keys(conteo)
          .map(id => +id)
          .sort((a, b) => conteo[b] - conteo[a]);

        const nombres: { [usuarioId: number]: string } = {};
        await Promise.all(usuarioIds.map(async usuarioId => {
          try {
            const usuario = await this.usuarioApiService.getUsuarioById(usuarioId).toPromise();
            nombres[usuarioId] = usuario.nombre;
          } catch {
            nombres[usuarioId] = 'Usuario ' + usuarioId;
          }
        }));

        // Paleta de colores
        const colores = [
          '#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EC407A',
          '#FF7043', '#26A69A', '#D4E157', '#FFCA28', '#8D6E63'
        ];
        const backgroundColor = usuarioIds.map((_, i) => colores[i % colores.length]);

        this.barChartLabels = usuarioIds.map(id => nombres[id]);
        this.barChartData = [{
          data: usuarioIds.map(id => conteo[id]),
          label: 'Posts por usuario',
          backgroundColor
        }];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  cargarComentarios(): void {
    this.comentariosApiService.getComentariosByComunidadId(Number(this.comunidadId)).subscribe({
      next: async (comentarios) => {
        // Contar comentarios por usuarioId
        const conteo: { [usuarioId: number]: number } = {};
        comentarios.forEach((comentario: any) => {
          conteo[comentario.usuarioId] = (conteo[comentario.usuarioId] || 0) + 1;
        });

        const usuarioIds = Object.keys(conteo)
          .map(id => +id)
          .sort((a, b) => conteo[b] - conteo[a]);

        const nombres: { [usuarioId: number]: string } = {};
        await Promise.all(usuarioIds.map(async usuarioId => {
          try {
            const usuario = await this.usuarioApiService.getUsuarioById(usuarioId).toPromise();
            nombres[usuarioId] = usuario.nombre;
          } catch {
            nombres[usuarioId] = 'Usuario ' + usuarioId;
          }
        }));

        // Paleta de colores
        const colores = [
          '#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EC407A',
          '#FF7043', '#26A69A', '#D4E157', '#FFCA28', '#8D6E63'
        ];
        const backgroundColor = usuarioIds.map((_, i) => colores[i % colores.length]);

        this.commentChartLabels = usuarioIds.map(id => nombres[id]);
        this.commentChartData = [{
          data: usuarioIds.map(id => conteo[id]),
          label: 'Comentarios por usuario',
          backgroundColor
        }];
        this.loadingComments = false;
      },
      error: () => {
        this.loadingComments = false;
      }
    });
  }
}
