export interface Task {
  id: number;
  title: string;
  isImportant: boolean;
  isCompleted: boolean;
  creationDate: Date;
  endDate: Date;
}
