import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./User"
import * as uuid from 'uuid'

@Entity()
class AuthToken extends BaseEntity {

  @PrimaryColumn("uuid")
  token: string

  @Column({ default: () => "(CURRENT_TIMESTAMP + interval '3' day)" })
  expiry: Date

  @PrimaryColumn("uuid")
  refreshToken: string

  @Column({ default: () => "(CURRENT_TIMESTAMP + interval '30' day)" })
  refreshExpiry: Date

  @OneToOne(type => User, { nullable: false })
  @JoinColumn()
  user: User

  public constructor() {
    super()
    this.token = uuid.v4()
    this.refreshToken = uuid.v4()
  }
}

export { AuthToken }