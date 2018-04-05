import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
class PasswordResetRequest extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  token: string

  @Column({ default: () => "(CURRENT_TIMESTAMP + interval '1' day)" })
  expiry: Date

  @OneToOne(type => User, { nullable: false })
  @JoinColumn()
  user: User

}

export { PasswordResetRequest }