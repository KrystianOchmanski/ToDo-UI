import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { baseUrl } from '../../utils';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${baseUrl}/task`;

  // BehaviorSubject to hold the current state of tasks
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable(); // Observable to expose the state

  constructor(private http: HttpClient) {}

  // Fetch tasks from the server
  getTasks(): void {
    this.http
      .get<Task[]>(this.apiUrl)
      .pipe(
        tap((tasks) => this.tasksSubject.next(tasks)),
        catchError(this.handleError)
      )
      .subscribe();
  }

  // Fetch a specific task by ID
  getTaskById(id: number): Observable<Task> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Task>(url).pipe(catchError(this.handleError));
  }

  // Add a new task
  addTask(task: Omit<Task, 'id'>): void {
    this.http
      .post<Task>(this.apiUrl, task)
      .pipe(
        tap((newTask) => {
          const currentTasks = this.tasksSubject.getValue();
          this.tasksSubject.next([...currentTasks, newTask]); // Add the new task
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  // Update an existing task
  updateTask(task: Task): void {
    const url = `${this.apiUrl}/${task.id}`;
    this.http
      .put<Task>(url, task)
      .pipe(
        tap((updatedTask) => {
          const currentTasks = this.tasksSubject.getValue();
          const updatedTasks = currentTasks.map((t) =>
            t.id === updatedTask.id ? updatedTask : t
          );
          this.tasksSubject.next(updatedTasks); // Update the task list
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  // Delete a task
  deleteTask(id: number): void {
    const url = `${this.apiUrl}/${id}`;
    this.http
      .delete<void>(url)
      .pipe(
        tap(() => {
          const currentTasks = this.tasksSubject.getValue();
          const updatedTasks = currentTasks.filter((task) => task.id !== id);
          this.tasksSubject.next(updatedTasks); // Remove the task
        }),
        catchError(this.handleError)
      )
      .subscribe();
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `A client-side error occurred: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server returned code ${error.status}, message was: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
