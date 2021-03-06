import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./User"
import * as uuid from 'uuid'

@Entity()
class PasswordResetRequest extends BaseEntity {

  @PrimaryColumn("uuid")
  token: string

  @Column({ default: () => "(CURRENT_TIMESTAMP + interval '1' day)" })
  expiry: Date

  @OneToOne(type => User, { nullable: false })
  @JoinColumn()
  user: User

  public constructor() {
    super()
    this.token = uuid.v4()
  }
}

export { PasswordResetRequest }