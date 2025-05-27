import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MainViewCommunityComponent } from './main-view-community/main-view-community.component';
import { CreatePubliComponentComponent } from './create-publi-component/create-publi-component.component';
import { CreateCommunityComponent } from './create-community/create-community.component';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { ViewPostComponent } from './view-post/view-post.component';
import { authGuard } from './guards/auth.guard';
import { AdminCommunityComponent } from './admin-community/admin-community.component';
import { isAdminGuard } from './guards/is-admin.guard';
import { HomeViewComponent } from './home-view/home-view.component';
import { EditCommunityViewComponent } from './edit-community-view/edit-community-view.component';
import { comunidadExpulsadoGuard } from './guards/comunidad-expulsado-guard.guard';
import { ViewUserProfileComponent } from './view-user-profile/view-user-profile.component';
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {path: '', component: HomeViewComponent},
      {path: 'usuario/:id', component:ViewUserProfileComponent},
      {path: 'comunidad/:id', component: MainViewCommunityComponent },
      {path:'comunidad/editar/:id', component: EditCommunityViewComponent, canActivate: [authGuard]},
      {path: 'crear-publicacion/:id',component: CreatePubliComponentComponent,canActivate: [authGuard]},
      {path: 'crear-comunidad',component: CreateCommunityComponent,canActivate: [authGuard]},
      {path: 'publicacion/:id', component: ViewPostComponent, canActivate: [comunidadExpulsadoGuard] },
      {path: 'administrar-comunidad/:id', component: AdminCommunityComponent, canActivate: [isAdminGuard] },
    ],
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];
