import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Task } from '../models/task.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-info',
  imports: [ReactiveFormsModule],
  templateUrl: './task-info.component.html',
  styleUrl: './task-info.component.css',
})
export class TaskInfoComponent implements OnInit, OnChanges {
  @Input() task!: Task;
  @Output() closed: EventEmitter<Task> = new EventEmitter<Task>();

  taskForm!: FormGroup;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      // Form init when task changes
      this.initForm();
    }
  }

  private initForm() {
    this.taskForm = new FormGroup({
      title: new FormControl(this.task?.title, [Validators.required]),
      endDate: new FormControl(this.task?.endDate),
      isImportant: new FormControl(this.task?.isImportant),
      isCompleted: new FormControl(this.task?.isCompleted),
    });
  }

  close() {
    this.closed.emit();
  }

  submit() {
    if (this.taskForm.valid) {
      // Utwórz kopię zadania z wartości formularza
      const updatedTask = { ...this.task, ...this.taskForm.value };

      // Wywołaj metodę updateTask z TaskService
      this.taskService.updateTask(updatedTask);
    }
  }
}
