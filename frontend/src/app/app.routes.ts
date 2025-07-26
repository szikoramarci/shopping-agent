import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { AuthGuard } from '../guards/auth.guard';
import { RequirementComponent } from '../components/requirement/requirement.component';
import { QueueViewerComponent } from '../components/queue-viewer/queue-viewer.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'requirement',
    component: RequirementComponent,
    canActivate: [AuthGuard],
  },
  { path: 'queue', component: QueueViewerComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' },
];
