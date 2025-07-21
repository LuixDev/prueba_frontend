import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TareaService, Tarea } from './tarea.service';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, MatFormFieldModule,MatPaginatorModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  titulo: string = '';
  descripcion: string = '';
  fechaLimite: string = '';
  filtro: string = '';
  tareas: Tarea[] = [];
  tareasPaginadas: Tarea[] = [];
  tareasFiltradas: Tarea[] = []; // Para almacenar tareas después del filtro

  pageSize = 5;
  paginaActual = 0;

  tareaEdit: Tarea = {
    id: 0,
    titulo: '',
    descripcion: '',
    fechaLimite: '',
    completada: false
  };
  fechaLimiteInvalida = false;
  constructor(private tareaService: TareaService) {}

  ngOnInit(): void {

    
  
    this.cargarTareas();

   
      this.tareas.push({
        titulo: ``,
        descripcion: '',
        fechaLimite: '',
         completada: false
      });
    
    this.actualizarTareasPaginadas();
  }

  cambiarPagina(event: PageEvent) {
  this.pageSize = event.pageSize;
  this.paginaActual = event.pageIndex;
  this.actualizarTareasPaginadas();
}


aplicarFiltro(): void {
  const texto = this.filtro.toLowerCase().trim();

  // Filtra tareas si hay texto, sino usa todas
  this.tareasFiltradas = texto
    ? this.tareas.filter(tarea =>
        tarea.titulo.toLowerCase().includes(texto) ||
        tarea.descripcion.toLowerCase().includes(texto) ||
        tarea.fechaLimite.toLowerCase().includes(texto) ||
        (texto === 'completada' && tarea.completada) ||
        (texto === 'no completada' && !tarea.completada)
      )
    : [...this.tareas];

  // Siempre reinicia a la página 0 si se aplica filtro nuevo
  this.paginaActual = 0;
  this.actualizarTareasPaginadas();
}



actualizarTareasPaginadas() {
  const base = this.filtro.trim() ? this.tareasFiltradas : this.tareas;

  const inicio = this.paginaActual * this.pageSize;
  const fin = inicio + this.pageSize;

  this.tareasPaginadas = base.slice(inicio, fin);
}

  

cargarTareas(): void {
  this.tareaService.getTareas().subscribe(data => {
    this.tareas = data;
    this.aplicarFiltro(); // Aplica el filtro después de cargar tareas
  });
}


  abrirModal(): void {
    const modal = document.getElementById('formularioModal');
    if (modal) modal.classList.remove('hidden');
  }

  cerrarModal(): void {
    const modal = document.getElementById('formularioModal');
    if (modal) modal.classList.add('hidden');
  }

  guardarTarea(): void {
  // Verificar campos vacíos
  if (!this.titulo || !this.descripcion || !this.fechaLimite) {
    return; // HTML ya mostrará mensajes requeridos
  }

  // Validar que la fecha límite no esté en el pasado
  const hoy = new Date();
  const fecha = new Date(this.fechaLimite);
  this.fechaLimiteInvalida = fecha < new Date(hoy.setHours(0, 0, 0, 0));

  if (this.fechaLimiteInvalida) {
    return;
  }

  // Crear objeto de tarea
  const nuevaTarea: Tarea = {
    titulo: this.titulo,
    descripcion: this.descripcion,
    fechaLimite: this.fechaLimite,
    completada: false
  };

  // Enviar al backend
  this.tareaService.crearTarea(nuevaTarea).subscribe(() => {
    this.cargarTareas();  // Refresca lista
    this.cerrarModal();   // Cierra modal

    // Limpiar campos
    this.titulo = '';
    this.descripcion = '';
    this.fechaLimite = '';
    this.fechaLimiteInvalida = false;
  });
}
  abrirEditarModal(tarea: Tarea): void {
    this.tareaEdit = { ...tarea };
    const modal = document.getElementById('editarModal');
    if (modal) modal.classList.remove('hidden');
  }

  cerrarEditarModal(): void {
    const modal = document.getElementById('editarModal');
    if (modal) modal.classList.add('hidden');
  }

actualizarTarea(): void {
  const id = this.tareaEdit.id;

  if (id !== undefined && id !== null) {
    this.tareaService.actualizarTarea(id, this.tareaEdit).subscribe(() => {
      this.cargarTareas();
      this.cerrarEditarModal();
    });
  } else {
    console.error('ID de la tarea no definido');
  }
}


  eliminarTarea(id: number): void {
    this.tareaService.eliminarTarea(id).subscribe(() => {
      this.cargarTareas();
    });
  }
}
