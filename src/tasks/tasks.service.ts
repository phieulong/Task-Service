import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from './dtos/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { Repository } from 'typeorm';
import { SearchTaskDto } from './dtos/search-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private repository: Repository<Task>,
  ) {}

  async getById(id: string): Promise<Task> {
    const task = await this.repository.findOneBy({ id: id });
    if (!task) {
      throw new HttpException(
        { code: 400001, message: `Task with ID[${id}] not found.` },
        HttpStatus.BAD_REQUEST,
      );
    }
    return task;
  }

  async search(dto: SearchTaskDto): Promise<Task[]> {
    if (!Object.keys(dto).length) {
      return this.repository.query(`select * from task`);
    }
    const query = this.repository.createQueryBuilder('task');
    if (dto.title) {
      query.andWhere('LOWER(task.title) LIKE LOWER(:title)', {
        title: `%${dto.title}%`,
      });
    }
    if (dto.description) {
      query.andWhere('LOWER(task.description) LIKE LOWER(:description)', {
        description: `%${dto.description}%`,
      });
    }
    return query.getMany();
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.repository.create({
      title: dto.title,
      description: dto.description,
      status: TaskStatus.OPEN,
    });
    return this.repository.save(task);
  }

  async deleteById(id: string): Promise<string> {
    const result = await this.repository.delete(id);
    console.log(`Deleted ${result.affected} row(s).`);
    if (!result.affected) {
      return 'not found';
    }
    return 'deleted';
  }

  async updateStatus(id: string, status: string): Promise<Task> {
    const task = await this.getById(id);
    const taskStatus = TaskStatus[status];
    if (!taskStatus) {
      console.log('status invalid');
      return task;
    }
    task.status = taskStatus;
    return this.repository.save(task);
  }
}
