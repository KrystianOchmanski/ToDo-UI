import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../models/task.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-info',
  imports: [ReactiveFormsModule],
  templateUrl: './task-info.component.html',
  styleUrl: './task-info.component.css',
})
export class TaskInfoComponent implements OnInit {
  @Input() task!: Task;
  @Output() closed: EventEmitter<Task> = new EventEmitter<Task>();

  taskForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    // Form initialization
    this.taskForm = new FormGroup({
      title: new FormControl(this.task.title, [Validators.required]),
      endDate: new FormControl(this.task.endDate),
      isImportant: new FormControl(this.task.isImportant),
      isCompleted: new FormControl(this.task.isCompleted),
    });
  }

  close() {
    this.closed.emit();
  }

  submit() {
    if (this.taskForm.valid) {
      this.task = { ...this.task, ...this.taskForm.value };
      this.closed.emit(this.task);
    }
  }
}
