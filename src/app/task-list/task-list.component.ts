import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  errorMessage: string | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.errorMessage = null; // Clear previous errors
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load tasks.';
        console.error('Error loading tasks:', error);
      },
    });
  }

  onTaskCompletedChange(task: Task): void {
    // Local change
    const updatedTask = { ...task, isCompleted: !task.isCompleted };

    this.taskService.updateTask(updatedTask).subscribe({
      next: () => {
        // Front update
        task.isCompleted = updatedTask.isCompleted;
      },
      error: (err) => {
        console.error('Błąd podczas aktualizacji zadania:', err);
        alert('Błąd podczas aktualizacji zadania:');
      },
    });
  }
}
