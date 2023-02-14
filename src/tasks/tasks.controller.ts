import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { SearchTaskDto } from './dtos/search-task.dto';
import { UpdateTaskStatus } from './dtos/update-task-status.dto';
import { Task } from './tasks.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  search(@Query() dto: SearchTaskDto): Promise<Task[]> {
    return this.tasksService.search(dto);
  }

  @Get('/:id')
  getById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(dto);
  }

  @Delete('/:id')
  delete(@Param('id') id: string): Promise<string> {
    return this.tasksService.deleteById(id);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() req: UpdateTaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateStatus(id, req.status);
  }
}
