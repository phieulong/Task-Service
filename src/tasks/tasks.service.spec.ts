import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { TasksService } from './tasks.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';

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
    it('RETURN the result', async () => {
      const user = {
        id: randomUUID(),
        username: 'username',
        password: 'password',
        tasks: [],
      };
      const task = {
        id: randomUUID(),
        title: 'this is title',
        description: 'this is description',
        user: user,
      };
      repositoryMock.findOne.mockReturnValue(task);
      const result = await service.getById(task.id, user);
      expect(result).toEqual(task);
    });

    it('WHEN not found RETURN the error ', async () => {
      const user = {
        id: randomUUID(),
        username: 'username',
        password: 'password',
        tasks: [],
      };
      const idParam = randomUUID();
      repositoryMock.findOne.mockReturnValue(null);
      const result = service.getById(idParam, user);
      expect(result).rejects.toThrow(
        new HttpException(
          { code: 400001, message: `Task with ID[${idParam}] not found.` },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
