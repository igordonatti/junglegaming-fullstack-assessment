import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseValidateUserDTO {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;
}
