import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from "@angular/material/form-field";


@Component({
  selector: 'app-login',
   standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, MatFormFieldModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

    constructor(
    private http: HttpClient,
    private router: Router
  ) {}

   async login(): Promise<void> {
    const credentials = {
      email: this.email,
      password: this.password,
    };
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text' as 'json', // Cambiado a 'text' para recibir el token como texto
    };
  
  
    this.http
      .post<string>('http://localhost:8080/api/login', credentials, httpOptions) // Espera un string como respuesta
      .subscribe(
        (response) => {
          if (response) { // Verificar si se recibe una respuesta (el token)
           this.router.navigate(['/task']);
          }
         
        },
        (error) => {
        
           alert("Contraseña incorrecta o usario")
        }
      );
  }
}

