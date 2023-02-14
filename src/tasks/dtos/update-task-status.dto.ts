import { IsEnum } from 'class-validator';
import { TaskStatus } from '../tasks-status.enum';
export class UpdateTaskStatus {
  @IsEnum(TaskStatus)
  status: string;
}
