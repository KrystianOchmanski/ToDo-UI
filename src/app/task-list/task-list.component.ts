import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { CommonModule } from '@angular/common';
import { TaskInfoComponent } from '../task-info/task-info.component';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskInfoComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  selectedTask?: Task;
  errorMessage: string | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe((data) => {
      this.tasks = data;
    });

    this.taskService.getTasks();
  }

  selectTask(task: Task) {
    this.selectedTask = task;
  }

  taskInfoClosed() {
    this.selectedTask = undefined;
  }
}
