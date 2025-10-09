import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCommentDTO } from './dto/createComment.dto';
import { PaginationQueryDTO } from 'src/common/dto/pagination-query.dto';
import { UserDTO } from 'src/tasks/dto/user.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @MessagePattern({ cmd: 'create_comment' })
  async createComment(
    @Payload() payload: { createCommentDto: CreateCommentDTO; user: UserDTO },
  ) {
    return await this.commentsService.createComment(
      payload.createCommentDto,
      payload.user?.id,
    );
  }

  @MessagePattern({ cmd: 'all_comments_for_task' })
  async getAllCommentsForTask(
    @Payload() payload: { taskId: string; paginationQuery: PaginationQueryDTO },
  ) {
    return await this.commentsService.findAllForTask(payload.taskId, {
      page: payload.paginationQuery.page || 1,
      limit: payload.paginationQuery.limit || 10,
    });
  }
}
