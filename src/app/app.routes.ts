import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MainViewCommunityComponent } from './main-view-community/main-view-community.component';
import { CreatePubliComponentComponent } from './create-publi-component/create-publi-component.component';
import { CreateCommunityComponent } from './create-community/create-community.component';
import { RenderMode, ServerRoute } from '@angular/ssr';

export const routes: Routes = [ {path:'', component: MainLayoutComponent,
    children: [{ path: 'comunidad/:id', component: MainViewCommunityComponent },
        {path: 'crear-publicacion/:id', component: CreatePubliComponentComponent,},
        {path: 'crear-comunidad', component: CreateCommunityComponent}
    ]},
{path:'register', component:RegisterComponent},
{path:'login', component:LoginComponent},

];
