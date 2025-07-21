import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TaskComponent } from './task/task.component';
import { FormsModule } from '@angular/forms'; 
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // redirige a 'login'
  { path: 'login', component: LoginComponent },
  { path: 'task', component: TaskComponent },
                                                                       
];


@NgModule({
  imports: [FormsModule,RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
