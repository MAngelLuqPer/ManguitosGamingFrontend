import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MainViewCommunityComponent } from './main-view-community/main-view-community.component';

export const routes: Routes = [ {path:'', component: MainLayoutComponent,
    children: [{ path: 'comunidad/:id', component: MainViewCommunityComponent },]},
{path:'register', component:RegisterComponent},
{path:'login', component:LoginComponent},

];
