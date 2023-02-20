import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { TasksService } from './tasks.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

export type MockType<T> = { [P in keyof T]?: jest.Mock };

export const repositoryMockFactory = () => ({
  findOne: jest.fn(),
});

describe('TasksService', () => {
  let service: TasksService;
  let repositoryMock: MockType<Repository<Task>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    service = module.get<TasksService>(TasksService);
    repositoryMock = module.get(getRepositoryToken(Task));
  });
  describe('getById', () => {
    it('calls TasksService.getById should return the result ', async () => {
      const user = { id: '123', username: 'Alni', password: '123', tasks: [] };
      const task = { id: '123' };
      repositoryMock.findOne.mockReturnValue(task);
      const result = await service.getById(task.id, user);
      expect(result).toEqual(task);
    });

    it('calls TasksService.getById should return the error ', async () => {
      const user = { id: '123', username: 'Alni', password: '123', tasks: [] };
      repositoryMock.findOne.mockReturnValue(null);
      const result = service.getById('123', user);
      expect(result).rejects.toThrow(
        new HttpException(
          { code: 400001, message: `Task with ID[123] not found.` },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
