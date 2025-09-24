import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user ' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  email: string;
}
