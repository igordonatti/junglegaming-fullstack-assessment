import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseUserDTO {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  password: string;
}
