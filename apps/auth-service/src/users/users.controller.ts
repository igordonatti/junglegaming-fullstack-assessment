import { Body, Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(private userService: UsersService) {}

  @MessagePattern({ cmd: 'auth_create_user' })
  async signUp(@Body() user: CreateUserDTO) {
    return await this.userService.createUser(user);
  }
}
