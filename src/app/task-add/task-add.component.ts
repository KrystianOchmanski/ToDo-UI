import { Component, EventEmitter, Output } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  RequiredValidator,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-task-add',
  imports: [ReactiveFormsModule],
  templateUrl: './task-add.component.html',
  styleUrl: './task-add.component.css',
})
export class TaskAddComponent {
  task: Omit<Task, 'id'>;
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();

  taskForm!: FormGroup;

  constructor(private taskService: TaskService) {
    this.task = {
      title: '',
      isImportant: false,
      isCompleted: false,
    };

    this.taskForm = new FormGroup({
      title: new FormControl(this.task.title, Validators.required),
      endDate: new FormControl(this.task.endDate),
      isImportant: new FormControl(this.task.isImportant),
      isCompleted: new FormControl(this.task.isImportant),
    });
  }

  close() {
    this.closed.emit();
  }

  submit() {
    if (this.taskForm.valid) {
      this.taskService.addTask(this.taskForm.value);
      this.close();
    }
  }
}
