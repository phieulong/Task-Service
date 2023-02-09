import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dtos/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  getAll(): Task[] {
    return this.tasks;
  }

  create(dto: CreateTaskDto): Task {
    const { title, description } = dto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteById(id: string): string {
    let isNaN = true;
    for (let i = 0; i < this.tasks.length; i++) {
      this.tasks = this.tasks.filter((task) => task.id != id);
      if (this.tasks[i].id == id) {
        this.tasks.splice(i, 1);
        isNaN = false;
      }
    }
    console.log(this.tasks);
    if (isNaN == true) {
      return 'not found';
    }
    return 'deleted';
  }

  updateStatus(id: string, status: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (task === null) {
      console.log('not found');
      return task;
    }
    const taskStatus: TaskStatus = TaskStatus[status];
    if (taskStatus === null) {
      console.log('status invalid');
      return task;
    }
    task.status = taskStatus;
    return task;
  }
}
