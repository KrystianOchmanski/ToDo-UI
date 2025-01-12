import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseUrl } from '../../utils';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${baseUrl}/task`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getTaskById(id: number): Observable<Task> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Task>(url).pipe(catchError(this.handleError));
  }

  addTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http
      .post<Task>(this.apiUrl, task)
      .pipe(catchError(this.handleError));
  }

  updateTask(task: Task): Observable<Task> {
    const url = `${this.apiUrl}/${task.id}`;
    return this.http.put<Task>(url, task).pipe(catchError(this.handleError));
  }

  deleteTask(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

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
