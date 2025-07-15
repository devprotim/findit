import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { JobCreateComponent } from './components/job-create/job-create.component';
import { ApplicationListComponent } from './components/application-list/application-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { EmployerGuard } from './guards/employer.guard';
import { JobSeekerGuard } from './guards/job-seeker.guard';

const routes: Routes = [
  { path: '', redirectTo: '/jobs', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/:id', component: JobDetailComponent },
  {
    path: 'create-job',
    component: JobCreateComponent,
    canActivate: [AuthGuard, EmployerGuard]
  },
  {
    path: 'my-jobs',
    component: JobListComponent,
    canActivate: [AuthGuard, EmployerGuard],
    data: { employerJobs: true }
  },
  {
    path: 'my-applications',
    component: ApplicationListComponent,
    canActivate: [AuthGuard, JobSeekerGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/jobs' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
