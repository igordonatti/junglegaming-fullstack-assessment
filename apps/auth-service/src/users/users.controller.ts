import { Body, Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ResponseUserDTO } from './dto/responseUser.dto';
import { User } from './entities/user.entity';

@Controller()
export class UsersController {
  constructor(private userService: UsersService) {}

  @MessagePattern({ cmd: 'auth_create_user' })
  async signUp(@Body() user: CreateUserDTO) {
    return await this.userService.createUser(user);
  }

  @MessagePattern({ cmd: 'users_get_by_id' })
  async getById(@Body() id: string): Promise<ResponseUserDTO> {
    return await this.userService.findById(id);
  }

  @MessagePattern({ cmd: 'find_all_users' })
  async getAll(): Promise<User[]> {
    return await this.userService.findAllUsers();
  }

  @MessagePattern({ cmd: 'get_users_by_ids' })
  async getByIds(@Payload() payload: { userIds: string[] }) {
    console.log('estou no controller', payload.userIds);
    return await this.userService.findUsersByIds(payload.userIds);
  }
}
