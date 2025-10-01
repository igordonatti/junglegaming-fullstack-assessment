import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Task } from 'src/tasks/entities/task.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateCommentDTO } from './dto/createComment.dto';
import { RpcException } from '@nestjs/microservices';
import { Comment } from './entities/comments.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CommentsService {
  private logger = new Logger();
  private readonly commentRepository: Repository<Comment>;
  private readonly taskRepository: Repository<Task>;

  constructor(private readonly dataSource: DataSource) {
    this.commentRepository = this.dataSource.getRepository(Comment);
    this.taskRepository = this.dataSource.getRepository(Task);
  }

  async createComment(createCommentDTO: CreateCommentDTO, userId: string) {
    const task = await this.taskRepository.findOneBy({
      id: createCommentDTO.taskId,
    });
    if (!task)
      throw new RpcException(
        new NotFoundException(
          `Task com ID ${createCommentDTO.taskId} não encontrada.`,
        ),
      );

    const newComment = this.commentRepository.create({
      content: createCommentDTO.content,
      authorId: userId,
      task: { id: task.id },
    });

    return this.commentRepository.save(newComment);
  }

  async findAllForTask(taskId: string, options: IPaginationOptions) {
    return paginate<Comment>(this.commentRepository, options, {
      where: {
        task: {
          id: taskId,
        },
      },
    });
  }
}
