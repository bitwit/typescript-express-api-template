import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./User"
import * as uuid from 'uuid'

@Entity()
class EmailVerificationRequest extends BaseEntity {

  @PrimaryColumn("uuid")
  token: string

  @OneToOne(type => User, { nullable: false })
  @JoinColumn()
  user: User

  public constructor() {
    super()
    this.token = uuid.v4()
  }
}

export { EmailVerificationRequest }