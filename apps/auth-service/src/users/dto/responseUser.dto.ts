/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseUserDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
