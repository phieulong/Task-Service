import { IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks.model';
export class UpdateTaskStatus {
  @IsEnum(TaskStatus)
  status: string;
}
