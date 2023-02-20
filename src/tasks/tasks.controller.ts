import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/users.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { SearchTaskDto } from './dtos/search-task.dto';
import { UpdateTaskStatus } from './dtos/update-task-status.dto';
import { Task } from './tasks.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController');
  constructor(private tasksService: TasksService) {}

  @Get()
  search(@Query() dto: SearchTaskDto, @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(
      `[search] User[${
        user.username
      }] retreiving tasks with Filter: ${JSON.stringify(dto)}`,
    );
    return this.tasksService.search(dto, user);
  }

  @Get('/:id')
  getById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getById(id, user);
  }

  @Post()
  create(@Body() dto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    return this.tasksService.create(dto, user);
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @GetUser() user: User): Promise<string> {
    return this.tasksService.deleteById(id, user);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() req: UpdateTaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateStatus(id, req.status, user);
  }
}
