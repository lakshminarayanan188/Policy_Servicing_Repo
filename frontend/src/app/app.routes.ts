import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'schedulers', 
        loadComponent: () => import('./features/scheduler/scheduler.component').then(m => m.SchedulerComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
