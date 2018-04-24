import {Entity, BaseEntity, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm"

enum Role {
  Admin,
  User
}

@Entity()
class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ default: Role.User })
  role: Role

}

export { User }