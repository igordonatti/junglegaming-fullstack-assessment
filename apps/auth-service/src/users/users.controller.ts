import { Body, Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { MessagePattern } from '@nestjs/microservices';
import { ResponseUserDTO } from './dto/responseUser.dto';

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
}
