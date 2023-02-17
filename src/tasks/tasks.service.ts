import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from './dtos/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { Repository } from 'typeorm';
import { SearchTaskDto } from './dtos/search-task.dto';
import { User } from 'src/auth/users.entity';
import { TransformInterceptor } from 'src/transform.interceptor';

@Injectable()
@UseInterceptors(TransformInterceptor)
export class TasksService {
  private logger = new Logger('TasksService');
  constructor(
    @InjectRepository(Task)
    private repository: Repository<Task>,
  ) {}

  async getById(id: string, user: User): Promise<Task> {
    const task = await this.repository.findOne({ where: { id, user } });
    if (!task) {
      this.logger.log(
        `[getById] User[${user.username}] try to get Task[${id}] but not found.`,
      );
      throw new HttpException(
        { code: 400001, message: `Task with ID[${id}] not found.` },
        HttpStatus.BAD_REQUEST,
      );
    }
    return task;
  }

  async search(dto: SearchTaskDto, user: User): Promise<Task[]> {
    const query = this.repository.createQueryBuilder('task');

    if (user) {
      query.where({ user });
    }

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
    this.logger.log(
      `[search] User[${
        user.username
      }] retreiving all tasks with filter[${JSON.stringify(dto)}]`,
    );
    return query.getMany();
  }

  async create(dto: CreateTaskDto, user: User): Promise<Task> {
    let task = this.repository.create({
      title: dto.title,
      description: dto.description,
      status: TaskStatus.OPEN,
      user,
    });
    task = await this.repository.save(task);
    this.logger.log(
      `[create] User[${user.username}] created Task[${JSON.stringify(task)}]`,
    );
    return task;
  }

  async deleteById(id: string, user: User): Promise<string> {
    const result = await this.repository.delete({ id, user });
    console.log(`Deleted ${result.affected} row(s).`);
    if (!result.affected) {
      this.logger.log(
        `[deleteById] User[${user.username}] try to delete Task[${id}] but not found.`,
      );
      return 'not found';
    }
    this.logger.log(
      `[deleteById] User[${user.username}] deleted Task[${id}] successed.`,
    );
    return 'deleted';
  }

  async updateStatus(id: string, status: string, user: User): Promise<Task> {
    let task = await this.getById(id, user);
    const taskStatus = TaskStatus[status];
    if (!taskStatus) {
      this.logger.log(
        `[updateStatus] User[${user.username}] try to update status of Task[${id}] but status[${status}] invalid.`,
      );
      return task;
    }
    task.status = taskStatus;
    task = await this.repository.save(task);
    this.logger.log(
      `[updateStatus] User[${user.username}] updated status of Task[${id}] successed.`,
    );
    return task;
  }
}
