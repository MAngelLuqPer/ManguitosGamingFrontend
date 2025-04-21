import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [ {path:'', component: MainLayoutComponent,
},
{path:'register', component:RegisterComponent},
{path:'login', component:LoginComponent},];
