import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
class AuthToken extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  token: string

  @Column({ default: () => "(CURRENT_TIMESTAMP + interval '3' day)" })
  expiry: Date

  @PrimaryGeneratedColumn("uuid")
  refreshToken: string

  @Column({ default: () => "(CURRENT_TIMESTAMP + interval '30' day)" })
  refreshExpiry: Date

  @OneToOne(type => User, { nullable: false })
  @JoinColumn()
  user: User

}

export { AuthToken }