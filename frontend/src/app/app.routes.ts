import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { AuthGuard } from '../guards/auth.guard';
import { RequirementComponent } from '../components/requirement/requirement.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'requirement', component: RequirementComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];
